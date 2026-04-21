# MNIST SVM Hyper‑parameter Search & Benchmark On Multiple Kernels

This project is for CS 4375 Machine Learning Course

A simple, reproducible baseline that reaches ~97% accuracy support vector machines

---

## 1 Overview

This project benchmarks **Support‑Vector Machines (SVMs)** on the **MNIST** handwritten‑digit dataset.  
It performs a grid search over three kernels (linear, polynomial, RBF), visualises cross‑validation performance, saves the best model, and reports the final test‑set accuracy.

Core features  
* **Automated data pipeline** – downloads MNIST with `fetch_openml` and creates a 10 k / 10 k stratified split.  
* **Exhaustive grid search** – 27‑combination search over C, degree/γ using 3‑fold cross‑validation (`GridSearchCV`).  
* **Reproducible visualisations** – generates `linear_cv_results.png`, `poly_cv_results.png`, and `rbf_cv_results.png`.  
* **Model persistence** – saves the best estimator to `best_svm_mnist.pkl` for easy reuse.  
* **One‑click benchmark** – achieves ~**96.7 %** accuracy on the held‑out MNIST test set with the best RBF model.  
  

---

## 2 Information

Used sklearn.svm.SVC with the following kernel types:
- linear
- poly (varied the polynomial degree)
- rbf (varied the gamma parameter)

Performed 3-fold cross-validation using a 10,000-sample subset of the MNIST dataset. 

Subset was selected using stratified sampling to preserve class balance.
- Varied the regularization parameter C (e.g., values like 0.1, 1, 10) for each kernel and evaluated its impact on classification performance.
- Reported cross-validation results in a table showing accuracy (mean standard deviation) for each kernel and each setting of C.

---

## 3 Prerequisites
| package      | tested version |
| ------------ | -------------- |
| Python       | ≥ 3.12         |
| scikit‑learn | 1.4.x          |
| pandas       | 2.x            |
| numpy        | 1.26.x         |
| matplotlib   | 3.8.x          |
| joblib       | 1.3.x          |

```bash
# clone / download the repo, then:
python svm.py
python svm_kernel.py
```

---
## 4 Report

The script will

1. Download MNIST (first run only).
2. Conduct a 27‑point grid search (3 × 3 × 3) with 3‑fold CV.
3. Save raw results to **`cv_results.csv`** and plots to PNGs.
4. Evaluate the best‑CV model on the 10 000‑sample test set.
5. Persist the model and write **`test_accuracy.txt`**.

![linear](/linear_cv_results.png)

![poly](/poly_cv_results.png)

![rbf](/rbf_cv_results.png)

| Kernel | C   | Degree | Gamma | Mean CV Accuracy | Std. Dev. |
| ------ | --- | ------ | ----- | ---------------- | --------- |
| linear | 0.1 | –      | –     | 0.9062           | 0.002573  |
| linear | 1   | –      | –     | 0.9062           | 0.002573  |
| linear | 10  | –      | –     | 0.9062           | 0.002573  |
| poly   | 0.1 | 2      | –     | 0.9118           | 0.002439  |
| poly   | 0.1 | 3      | –     | 0.8867           | 0.001009  |
| poly   | 0.1 | 4      | –     | 0.8279           | 0.001723  |
| poly   | 1   | 2      | –     | 0.9511           | 0.002128  |
| poly   | 1   | 3      | –     | 0.9460           | 0.000728  |
| poly   | 1   | 4      | –     | 0.9209           | 0.002211  |
| poly   | 10  | 2      | –     | 0.9559           | 0.004180  |
| poly   | 10  | 3      | –     | 0.9489           | 0.001895  |
| poly   | 10  | 4      | –     | 0.9355           | 0.002243  |
| rbf    | 0.1 | –      | scale | 0.9184           | 0.002775  |
| rbf    | 0.1 | –      | 0.01  | 0.1125           | 0.000016  |
| rbf    | 0.1 | –      | 0.001 | 0.1125           | 0.000016  |
| rbf    | 1   | –      | scale | 0.9563           | 0.001799  |
| rbf    | 1   | –      | 0.01  | 0.1125           | 0.000016  |
| rbf    | 1   | –      | 0.001 | 0.1125           | 0.000016  |
| rbf    | 10  | –      | scale | 0.9626           | 0.002591  |
| rbf    | 10  | –      | 0.01  | 0.1125           | 0.000016  |
| rbf    | 10  | –      | 0.001 | 0.1125           | 0.000016  |

**Summarized Results**

| kernel  | hyper‑parameters (C, degree, γ) | CV accuracy   | test accuracy |
| ------- | ------------------------------- | ------------- | ------------- |
| **RBF** | C = 10, γ = `"scale"`           | 0.963 ± 0.002 | **0.9674**    |
| Poly    | C = 10, degree = 2              | 0.958 ± 0.003 | 0.960         |
| Linear  | C = 1                           | 0.906 ± 0.002 | 0.908         |

---
## 5 Reproducing / extending

- **Change train / test size** – `load_data(train_size=…, test_size=…)` in `svm.py`.
- **Add kernels / parameters** – edit `param_grid` inside `run_grid_search`.
- **Verbose fold‑level prints** – see `svm_kernel.py`, which manually loops through parameter grids and folds.
- **Use the trained model**:

---
### License

MIT
**scikit‑learn** documentation – SVC, GridSearchCV.
