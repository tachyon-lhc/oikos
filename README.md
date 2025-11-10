# 🏠 House Price Predictor

Diseña el plano de tu casa y obtén una predicción de precio instantánea usando Machine Learning.

---

## ✨ ¿Qué hace?

Una aplicación web que te permite dibujar habitaciones interactivamente y predice el precio de la vivienda usando un modelo de Random Forest entrenado con 545 propiedades reales.

---

## 🚀 Cómo usar

1. **Dibuja habitaciones** - Click y arrastra para crear espacios

2. **Etiqueta cada espacio** - Click derecho → selecciona el tipo

3. **Completa los datos** - Área total, características adicionales

4. **Obtén el precio** - Click en "Calcular valor"

---

## 💻 Instalación Local

```bash
# Clonar
git clone https://github.com/tu-usuario/house-price-predictor.git
cd house-price-predictor

# Instalar dependencias
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Entrenar modelo y correr
python src/train_model.py
python src/app.py
```

Abre `http://localhost:5000`

---

## 🛠️ Stack Tecnológico

**Frontend:** Vanilla JavaScript, SVG Canvas, CSS3  
**Backend:** Flask, Python  
**ML:** Scikit-learn (Random Forest)  
**Deploy:** Render

---

## 📊 Rendimiento del Modelo

- **R² Score:** 0.61 (explica el 61% de la varianza)
- **Error promedio:** ~$1M USD
- **Feature más importante:** Área total (47%)

---

## 📁 Estructura

```
├── src/
│   ├── app.py           # Flask API
│   ├── train_model.py   # Entrenamiento ML
│   └── models/          # Modelo guardado
├── static/              # CSS/JS
├── templates/           # HTML
└── data/               # Dataset
```

---

## 🤝 Contribuir

Pull requests son bienvenidos. Para cambios grandes, abre un issue primero.
