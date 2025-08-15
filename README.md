# Underwater_waste_Detection

Base YOLOv8 model artifacts ready for API + dashboard.

## Contents
- `api/model/best.pt` — trained weights
- `api/training/results.csv` — training log
- `api/training/metrics.json` — compact metrics for charts

Next steps (we'll add these together):
- Flask API with /predict, /health, /training/metrics
- React dashboard (Detect, Metrics, System)
- Dockerfiles and GitHub Actions (CI/CD)
