# 🏠 House Price Predictor

Design your house floor plan and get an instant price prediction using Machine Learning.

---

## Official Web

<https://oikos-9jw1.onrender.com/>

## ![principal](./images/oikos-principal.png)

---

## What does it do?

A web application that allows you to draw rooms interactively and predicts the housing price using a Random Forest model trained with over 72k real properties.

---

## Where does it get the data from?

I obtained the data using a scraper that you can find in my repository: <https://github.com/tachyon-lhc/ml-web-sraping>
In which I scrape data from Mercado Libre Inmuebles. In more than 30 locations in Buenos Aires.

## How to use

1. **Draw rooms**

2. **Label each space**

3. Move, Scale, Delete: Rooms

![blueprint](./images/blueprint.png)

1. **Complete the data** - Total area, additional features

![additional](./images/additional-information.png)

1. **Get the price** - Click on "Calcular valor"

![show-price](./images/show_results.png)

## Local Installation

```bash
# Clone
git clone https://github.com/tachyon/oikos.git
cd oikos

# Install dependencies
python -m venv venv
source venv/bin/activate
pip install -r src/requirements.txt

# Train model and run
python src/app.py
```

---

## Tech Stack

**Frontend:** Vanilla JavaScript, SVG Canvas, CSS3  
**Backend:** Flask, Python  
**ML:** Scikit-learn (Random Forest)  
**Deploy:** Render

---

## Model Performance

- **R² Score:** 0.72 (explains 72% of the variance)

---

## Structure

```
├── src/
│   ├── app.py           # Flask API
│   ├── train_model.py   # ML Training
│   └── models/          # Saved model
├── static/              # CSS/JS
├── templates/           # HTML
└── data/               # Dataset
```

---

## Contributing

Pull requests are welcome. For major changes, please open an issue first.
