# Tree‑Based Classifiers & Ensemble Methods

This project is for CS 4375 Machine Learning Course

Evaluated four scikit‑learn classifiers—**Decision Tree**, **Bagging**, **Random Forest**, and **Gradient Boosting**—on two sets of problems:

1. **15 synthetic Boolean‑CNF datasets** of varying size/complexity.
2. **MNIST handwritten‑digit recognition** and **image classification**.

---
```bash
├── classifier.py           # Runs all four models on the 15 CNF datasets
├── mnist_classifier.py     # Runs the four models on MNIST
├── classifier_backup.py    # Earlier (more verbose) version of classifier.py
├── *.csv                   # 45 dataset files (train / valid / test) 
└── README.md               
```

---
## Setup

Download the 45 CSV files from the course shell and place them in the project root.  
Each filename follows the scheme:

```
train_c{CLAUSES}_d{SIZE}.csv
valid_c{CLAUSES}_d{SIZE}.csv
test_c{CLAUSES}_d{SIZE}.csv
```

- **CLAUSES  {300, 500, 1000, 1500, 1800}**
- **SIZE  {100, 1000, 5000}**

All features are binary {0, 1}; the **last column** is the class label (0 or 1)

---
## Running the Experiments

### 1. CNF datasets

```bash
python classifier.py
```

For every dataset the script:

1. Performs a 3‑fold **GridSearchCV** over  
    `criterion ∈ {gini, entropy}`,  
    `max_depth ∈ {5, 10, 20, 50, 100, None}`,  
    `min_samples_split ∈ {2, 5, 10, 20}`
    
2. Retrains each model (Decision Tree / Bagging / Random Forest / Gradient Boosting) on **train ∪ valid**.
    
3. Prints **Accuracy** and **F1‑score** on the held‑out **test** split.

Sample Output:

```bash
Dataset _c500_d100 - Decision Tree: Best Params={'criterion': 'gini', 'max_depth': 20, ...}, Accuracy=0.7867, F1 Score=0.7854
Dataset _c500_d100 - Bagging Classifier: Accuracy=0.8120, F1 Score=0.8117
...
```

### 2. MNIST

```bash
python mnist_classifier.py
```

- Downloads and normalizes the 70 000‑image MNIST 28 × 28 dataset.
- Reuses the best Decision‑Tree hyper‑parameters found earlier to seed Bagging.
- Reports **Accuracy** for all four models (F1 is omitted per project spec).

Sample Output:

```bash
MNIST - Decision Tree: Accuracy=0.8484
MNIST - Bagging Classifier: Accuracy=0.9488
MNIST - Random Forest Classifier: Accuracy=0.9751
MNIST - Gradient Boosting Classifier: Accuracy=0.9973
```

Both scripts fix `random_state=0` where applicable to ensure identical results across runs.

---
### License

MIT
