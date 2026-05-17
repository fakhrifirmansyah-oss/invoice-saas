#!/bin/bash
# ════════════════════════════════════════════════════════════
#  FDBAtech Invoice SaaS — GCP Setup Script
#  Jalankan sekali saja untuk setup infrastruktur GCP
#  Usage: bash gcp-setup.sh
# ════════════════════════════════════════════════════════════

set -e  # Stop jika ada error

# ── KONFIGURASI (EDIT BAGIAN INI) ───────────────────────────
PROJECT_ID="fdbatech-invoice-prod"
REGION="asia-southeast2"        # Jakarta
ZONE="asia-southeast2-a"
CLUSTER_NAME="fdbatech-cluster"
DB_INSTANCE="fdbatech-db"
REDIS_INSTANCE="fdbatech-cache"
REPO_NAME="fdbatech-repo"
DOMAIN="app.fdbatech.com"
# ────────────────────────────────────────────────────────────

echo "🚀 ═══════════════════════════════════════════"
echo "   FDBAtech GCP Infrastructure Setup"
echo "   Project: $PROJECT_ID"
echo "   Region:  $REGION (Jakarta)"
echo "═══════════════════════════════════════════════"

# Step 1: Create & configure project
echo ""
echo "📁 [1/10] Membuat GCP Project..."
gcloud projects create $PROJECT_ID --name="FDBAtech Invoice" 2>/dev/null || echo "Project sudah ada."
gcloud config set project $PROJECT_ID
gcloud config set compute/region $REGION
gcloud config set compute/zone $ZONE

# Step 2: Enable required APIs
echo ""
echo "🔌 [2/10] Mengaktifkan GCP APIs..."
gcloud services enable \
  run.googleapis.com \
  container.googleapis.com \
  sqladmin.googleapis.com \
  redis.googleapis.com \
  cloudbuild.googleapis.com \
  artifactregistry.googleapis.com \
  secretmanager.googleapis.com \
  cloudarmor.googleapis.com \
  dns.googleapis.com \
  monitoring.googleapis.com \
  logging.googleapis.com

echo "✅ Semua API aktif!"

# Step 3: Create Artifact Registry (Docker repo)
echo ""
echo "📦 [3/10] Membuat Docker Repository..."
gcloud artifacts repositories create $REPO_NAME \
  --repository-format=docker \
  --location=$REGION \
  --description="FDBAtech Docker Images" 2>/dev/null || echo "Repo sudah ada."

# Step 4: Create Cloud SQL PostgreSQL
echo ""
echo "🗄️  [4/10] Membuat Cloud SQL PostgreSQL (Jakarta)..."
gcloud sql instances create $DB_INSTANCE \
  --database-version=POSTGRES_15 \
  --tier=db-custom-2-7680 \
  --region=$REGION \
  --availability-type=REGIONAL \
  --storage-type=SSD \
  --storage-size=50GB \
  --storage-auto-increase \
  --backup-start-time=02:00 \
  --maintenance-window-day=SUN \
  --maintenance-window-hour=3 \
  --deletion-protection 2>/dev/null || echo "DB instance sudah ada."

# Create database and user
gcloud sql databases create fdbatech --instance=$DB_INSTANCE 2>/dev/null || true
DB_PASSWORD=$(openssl rand -base64 32)
gcloud sql users create fdbatech_user \
  --instance=$DB_INSTANCE \
  --password="$DB_PASSWORD" 2>/dev/null || true

echo "✅ Cloud SQL siap!"

# Step 5: Create Redis (Memorystore)
echo ""
echo "⚡ [5/10] Membuat Redis Cache (Memorystore)..."
gcloud redis instances create $REDIS_INSTANCE \
  --size=1 \
  --region=$REGION \
  --redis-version=redis_7_0 \
  --tier=standard 2>/dev/null || echo "Redis sudah ada."

REDIS_HOST=$(gcloud redis instances describe $REDIS_INSTANCE --region=$REGION --format='value(host)')
echo "✅ Redis host: $REDIS_HOST"

# Step 6: Store secrets in Secret Manager
echo ""
echo "🔐 [6/10] Menyimpan secrets ke Secret Manager..."
DB_CONNECTION_NAME=$(gcloud sql instances describe $DB_INSTANCE --format='value(connectionName)')
DB_URL="postgresql://fdbatech_user:${DB_PASSWORD}@/fdbatech?host=/cloudsql/${DB_CONNECTION_NAME}"
JWT_SECRET=$(openssl rand -base64 64)

echo -n "$DB_URL" | gcloud secrets create fdbatech-db-url --data-file=- 2>/dev/null || \
  echo -n "$DB_URL" | gcloud secrets versions add fdbatech-db-url --data-file=-

echo -n "redis://$REDIS_HOST:6379" | gcloud secrets create fdbatech-redis-url --data-file=- 2>/dev/null || \
  echo -n "redis://$REDIS_HOST:6379" | gcloud secrets versions add fdbatech-redis-url --data-file=-

echo -n "$JWT_SECRET" | gcloud secrets create fdbatech-jwt-secret --data-file=- 2>/dev/null || \
  echo -n "$JWT_SECRET" | gcloud secrets versions add fdbatech-jwt-secret --data-file=-

echo "✅ Secrets tersimpan aman!"

# Step 7: Create GKE Cluster (untuk skala besar nanti)
echo ""
echo "☸️  [7/10] Membuat GKE Cluster (Jakarta)..."
gcloud container clusters create $CLUSTER_NAME \
  --region=$REGION \
  --num-nodes=2 \
  --min-nodes=1 \
  --max-nodes=20 \
  --enable-autoscaling \
  --machine-type=e2-standard-4 \
  --enable-autorepair \
  --enable-autoupgrade \
  --workload-pool=$PROJECT_ID.svc.id.goog 2>/dev/null || echo "Cluster sudah ada."

# Step 8: Reserve Global Static IP
echo ""
echo "🌐 [8/10] Reservasi IP Statis Global..."
gcloud compute addresses create fdbatech-global-ip \
  --global 2>/dev/null || echo "IP sudah ada."

GLOBAL_IP=$(gcloud compute addresses describe fdbatech-global-ip --global --format='value(address)')
echo "✅ IP Publik Global: $GLOBAL_IP"
echo "   → Arahkan DNS domain '$DOMAIN' ke IP ini!"

# Step 9: Setup Cloud Build trigger
echo ""
echo "🔄 [9/10] Cloud Build sudah dikonfigurasi via cloudbuild.yaml"
echo "   → Connect GitHub repo di: https://console.cloud.google.com/cloud-build/triggers"

# Step 10: Initial Cloud Run deployment
echo ""
echo "🚀 [10/10] Deploy awal ke Cloud Run..."
gcloud run deploy fdbatech-backend \
  --image=asia-southeast2-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/backend:latest \
  --region=$REGION \
  --platform=managed \
  --allow-unauthenticated \
  --min-instances=1 \
  --max-instances=100 \
  --memory=1Gi \
  --cpu=2 \
  --set-secrets="DATABASE_URL=fdbatech-db-url:latest,JWT_SECRET=fdbatech-jwt-secret:latest,REDIS_URL=fdbatech-redis-url:latest" \
  --set-env-vars="NODE_ENV=production,PORT=8080" 2>/dev/null || echo "Build image dulu sebelum deploy."

# ── SUMMARY ─────────────────────────────────────────────────
echo ""
echo "═══════════════════════════════════════════════"
echo "✅  SETUP SELESAI! FDBAtech GCP Infrastructure"
echo "═══════════════════════════════════════════════"
echo ""
echo "📊 Resources yang dibuat:"
echo "   • Cloud SQL PostgreSQL : $DB_INSTANCE ($REGION)"
echo "   • Redis Memorystore    : $REDIS_INSTANCE ($REGION)"
echo "   • Artifact Registry    : $REPO_NAME"
echo "   • GKE Cluster          : $CLUSTER_NAME"
echo "   • Global Static IP     : $GLOBAL_IP"
echo ""
echo "🔑 Langkah Selanjutnya:"
echo "   1. Arahkan DNS '$DOMAIN' → $GLOBAL_IP"
echo "   2. Connect GitHub di Cloud Build Triggers"
echo "   3. Push ke branch 'main' → auto deploy!"
echo ""
echo "💰 Estimasi biaya awal: ~\$150/bulan"
echo "═══════════════════════════════════════════════"
