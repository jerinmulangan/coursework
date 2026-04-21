# Enron Spam Classification Project

This project is for CS 4375 Machine Learning Course

Implementations of **Multinomial Naïve Bayes**, **Bernoulli Naïve Bayes**, and **ℓ₂‑regularised Logistic Regression** for spam detection on the Enron e‑mail corpora (`enron1`, `enron2`, `enron4`). Contains text preprocessing (bag of words and bernoulli) and feature‑matrix construction to model training, hyper‑parameter tuning, and metric reporting.

---

## Key Features

|Stage|Script|Highlights|
|---|---|---|
|Dataset ➜ CSV|`enron_bb.py`|‑ Builds a shared vocabulary from the training split‑ Generates **Bag‑of‑Words** & **Bernoulli** matrices‑ Saves 12 CSVs following `dataset_representation_set.csv` naming scheme|
|Quality Check|`enron_bb_test.py`|Quick sanity checks on a generated CSV (shape, sparsity)|
|Multinomial NB|`enron_multinomial.py`|Add‑one Laplace smoothing, log‑space maths|
|Bernoulli NB|`enron_discrete.py`|Presence/absence modelling, log‑space maths|
|Logistic Reg.|`enron_log_reg.py`|Gradient‑ascent MCAP with ℓ₂, validation split for λ tuning|

All code is written for **Python ≥ 3.12** and relies only on open‑source libraries available via `conda` or `pip`.

---

```
.
├── data/                 # Enron zip files
│   └── enron{1,2,4}/
│       ├── train/{ham,spam}/
│       └── test/{ham,spam}/
├── enron_bb.py           # Build BoW & Bernoulli CSV datasets
├── enron_bb_test.py      # Optional CSV check
├── enron_multinomial.py  # Multinomial Naive Bayes (BoW only)
├── enron_discrete.py     # Bernoulli Discrete Naive Bayes (binary features)
├── enron_log_reg.py      # Logistic Regression (BoW & Bernoulli)
└── README.md             
```

```bash
# Create & activate an isolated environment (Python 3.9+)
conda create -n enron_spam python=3.9
conda activate enron_spam

# Install required libraries
pip install -r requirements.txt
python -m nltk.downloader punkt stopwords  # one‑off NLTK download

# Place raw datasets under data/
#    enron1/, enron2/, enron4/ each containing train/ & test/ splits

# Generate feature matrices (12 CSVs ≈ a few minutes)
python enron_bb.py

# Train & evaluate models
python enron_multinomial.py            # Multinomial NB on BoW
python enron_discrete.py               # Bernoulli NB on binary features
python enron_log_reg.py                # Logistic Regression on both
```

Each script prints **Accuracy, Precision, Recall, F1** for every dataset/representation; Logistic Regression additionally logs optimization progress and the chosen λ.

---
## Evaluation Metrics

| Metric    | Formula                                                  | Intuition                                   |
| --------- | -------------------------------------------------------- | ------------------------------------------- |
| Accuracy  | $\frac{TP+TN}{TP+TN+FP+FN}$                              | Overall correctness                         |
| Precision | $\frac{TP}{TP+FP}$                                       | When we flag spam, how often are we right?  |
| Recall    | $\frac{TP}{TP+FN}$                                       | Of all real spam, how much did we catch?    |
| F1‑Score  | $2\times\frac{Precision\times Recall}{Precision+Recall}$ | Harmonic balance between Precision & Recall |

`enron_multinomial.py`, `enron_discrete.py`, and `enron_log_reg.py` report these four scores for each test split.

---
## Generating the CSV Datasets in Detail

1. **Vocabulary Construction**  `enron_bb.py` scans _training_ e‑mails only.
    
    - Lower‑cases text, strips punctuation.
    - Removes English stop‑words (`nltk.corpus.stopwords`).
    - Keeps alphabetic tokens ≥ 1 character.
        
2. **Bag‑of‑Words Matrix**
    
    - `count(word_i in email_j)` — raw term frequencies.
        
3. **Bernoulli Matrix**
    
    - `1` if word appears ≥ once else `0`.
        
4. **CSV Output**
    
    - First `w` columns → features.
    - Final column `label` ∈ {0 (ham), 1 (spam)}.
        

Example file name → `enron1_bow_train.csv`.

- **Laplace Smoothing** in both NB flavours prevents zero probabilities.
    
- **Log‑space** mathematics safeguard against underflow when multiplying many small probabilities.
    
- **Logistic Regression** uses gradient ascent on the MCAP objective with an early‑stopping cap on iterations; λ chosen via 70 / 30 train‑validation split.
    
- Tested on Windows 10 & Ubuntu 22.04 with Python 3.12

---
## Experimental Results

### Logistic Regression

| Dataset | Representation | Accuracy | Precision | Recall | F1-score |
| ------- | -------------- | -------- | --------- | ------ | -------- |
| enron1  | Bernoulli      | 0.9583   | 0.9221    | 0.9530 | 0.9373   |
| enron1  | BoW            | 0.9583   | 0.9062    | 0.9732 | 0.9385   |
| enron2  | Bernoulli      | 0.9498   | 0.9077    | 0.9077 | 0.9077   |
| enron2  | BoW            | 0.9519   | 0.8963    | 0.9308 | 0.9132   |
| enron4  | Bernoulli      | 0.9705   | 0.9607    | 1.0000 | 0.9799   |
| enron4  | BoW            | 0.9595   | 0.9467    | 1.0000 | 0.9726   |


### Multinomial Naïve Bayes (Bag‑of‑Words)

| Dataset | Accuracy | Precision | Recall | F1-score |
| ------- | -------- | --------- | ------ | -------- |
| enron1  | 0.9320   | 0.9275    | 0.8591 | 0.8920   |
| enron2  | 0.9351   | 0.9091    | 0.8462 | 0.8765   |
| enron4  | 0.9687   | 0.9698    | 0.9872 | 0.9785   |


### Bernoulli Naïve Bayes (Discrete)

| Dataset   | Accuracy | Precision | Recall | F1-score |
| --------- | -------- | --------- | ------ | -------- |
| Aggregate | 0.9013   | 0.9906    | 0.7047 | 0.8235   |

---
## Summary

Each classifier's performance was optimized through hyperparameter tuning; for Naive Bayes classifiers, the main hyperparameter, alpha, regulates Laplace smoothing; for ogistic Regression, the key hyperparameter is the regularization strength (C), which was varied across a logarithmic scale from 0.01 to 10; the optimization solver used was 'lbfgs'; and the maximum number of iterations was set to 1000 to ensure convergence.

The combination of the Bag of Words representation with Logistic Regression performed the best. This method produced the best accuracy and F1-score, most likely as a result of the model's capacity to identify subtle word associations in the dataset. Logistic regression can model more intricate interactions, improving predictive performance, whereas Naive Bayes assumes that features are independent.

---
### License

MIT




