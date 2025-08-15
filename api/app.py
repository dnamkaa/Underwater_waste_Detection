import io, os, json
from flask import Flask, request, jsonify
from flask_cors import CORS
from ultralytics import YOLO
from PIL import Image
import pandas as pd

# --- config ---
MODEL_PATH = os.getenv("MODEL_PATH", "api/model/best.pt")
RESULTS_CSV = os.getenv("RESULTS_CSV", "api/training/results.csv")
METRICS_JSON = os.getenv("METRICS_JSON", "api/training/metrics.json")

app = Flask(__name__)
CORS(app)  # allow calls from your React dev server later

# Lazy-load YOLO so the app starts fast
_model = None
def get_model():
    global _model
    if _model is None:
        _model = YOLO(MODEL_PATH)
    return _model

def load_training_metrics():
    """
    Returns a compact metrics dict for charts.
    1) If metrics.json exists, return it.
    2) Else, if results.csv exists, derive a compact JSON from it.
    """
    if os.path.exists(METRICS_JSON):
        try:
            with open(METRICS_JSON, "r") as f:
                return json.load(f)
        except Exception:
            pass

    if os.path.exists(RESULTS_CSV):
        try:
            df = pd.read_csv(RESULTS_CSV)
            keep = [
                "epoch",
                "train/box_loss","train/cls_loss","train/dfl_loss",
                "metrics/precision(B)","metrics/recall(B)",
                "metrics/mAP50(B)","metrics/mAP50-95(B)"
            ]
            present = [c for c in keep if c in df.columns]
            return df[present].to_dict(orient="list")
        except Exception:
            pass

    return {"note": "No metrics found yet. Place metrics.json or results.csv in api/training/"}

@app.get("/health")
def health():
    ok = os.path.exists(MODEL_PATH)
    return jsonify({"status": "ok" if ok else "missing_model",
                    "model": MODEL_PATH})

@app.get("/training/metrics")
def training_metrics():
    return jsonify(load_training_metrics())

@app.post("/predict")
def predict():
    # Optional query params: conf, iou, imgsz
    try:
        conf = float(request.args.get("conf", 0.25))
        iou = float(request.args.get("iou", 0.45))
        imgsz = int(request.args.get("imgsz", 640))
    except Exception:
        return jsonify({"error": "invalid query params"}), 400

    if "file" not in request.files:
        return jsonify({"error": "missing file"}), 400

    file = request.files["file"]
    try:
        img = Image.open(io.BytesIO(file.read())).convert("RGB")
    except Exception:
        return jsonify({"error": "could not read image"}), 400

    m = get_model()
    results = m.predict(source=img, conf=conf, iou=iou, imgsz=imgsz, verbose=False)

    # Format detections as JSON
    dets = []
    r = results[0]
    if r.boxes is not None:
        for b in r.boxes:
            xyxy = [float(x) for x in b.xyxy[0].tolist()]
            dets.append({
                "bbox_xyxy": xyxy,
                "conf": float(b.conf[0]),
                "cls": int(b.cls[0]),
                "label": r.names[int(b.cls[0])]
            })

    return jsonify({
        "params": {"conf": conf, "iou": iou, "imgsz": imgsz},
        "detections": dets
    })

if __name__ == "__main__":
    # local dev server (we’ll switch to gunicorn in Docker step)
    app.run(host="0.0.0.0", port=8000, debug=True)
