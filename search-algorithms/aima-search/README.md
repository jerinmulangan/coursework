# AIMA‑Inspired Search Algorithms Collection

Some **search and game‑tree algorithms** implemented in Python, adapted from (and fully compatible with) the **[AIMA‑Python](https://github.com/aimacode/aima‑python) framework**.  
The repository is meant as a learning sandbox and reference for AI coursework, coding interviews, and hobby projects.

---

## Algorithms and Problems

| Category                          | Algorithms / Problems                                                                                                                                                                                           |
| --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Uninformed / Heuristic Search** | • **A\*** (graph + tree versions)<br>• **Alpha Beta Pruning**<br>• **Greedy Best‑First Search**<br>• **Hill‑Climbing** (steepest‑ascent & stochastic variants)                                                  |
| **Constraint & Logic Puzzles**    | • **Zebra Puzzle (“Einstein’s Riddle”)** CSP solver                                                                                                                                                             |
| **Classical Planning Problems**   | • **Missionaries & Cannibals** state‑space search                                                                                                                                                               |
| **Game‑Tree Algorithms**          | • **Minimax** (deterministic, two‑player)<br>• **Alpha‑Beta Pruning**<br>• **Chance Games** <br>• **Chance Nodes** (**Expectiminimax**)<br>• **Multi‑Agent Chance Games**<br>• **Multi‑Agent Stochastic Trees** |
| **Data Structures**               | • **B‑Tree** (search / insertion)<br>• **B+‑Tree** (search / insertion / range scan)                                                                                                                            |

Every module is **self‑contained**: importable as a library or runnable as a script with demo problems.

---

## Quick Start

```bash
# 1. Clone and enter
git clone https://github.com/jerinmulangan/aima-search.git
cd aima-search

# 2. (Recommended) create a virtual env
python -m venv .venv && source .venv/bin/activate   
# Windows: .venv\Scripts\activate

# Optionally run on Conda
conda create -n myenv python=3.13

```

### Running Examples

```bash
# Missionaries & Cannibals with A* (Manhattan distance heuristic)
python missionaries_cannibals.py --algo astar

# Zebra puzzle CSP – prints house assignments
python zebra.py

# Alpha‑Beta demo standard tree
python alpha_beta_prune.py

# A* Algorithm demo on flight paths
python astar_flight.py

# Insert & search demo in a B+‑Tree of order 4
python b+_tree.py

```

### Layout

```
aima-search/
│
├─ algorithms/          
│   ├─ astar_flight.py            # A* Algorithm on Flight Path Tree
│   ├─ astar_flight_test.py       # A* Algorithm Testing
│   ├─ gbfs_astar.py              # Greedy Best-First Search Algorithm
│   └─ hill_climbing.py           # Hill Climbing Algorithm
│
├─ games/
│   ├─ minimax.py                 # Minimax Tree and Algorith
│   ├─ alpha_beta_prune.py        # Alpha Beta Pruning on Standard Tree
│   ├─ chance_game.py             # Chance Game on Standard Tree
│   ├─ chance_game_tree.ipynb     # Game Tree for Chance
│   ├─ expectimax_chance.py       # Expectimax Game with Chance
│   ├─ game_tree_jupyter.ipynb    # Game Tree for Expectimax
│   └─ multiagent_chance.py       # Multi-Agent Chance Game
│
├─ puzzles/
│   ├─ missionaries_cannibals.py  # Missionaries and Cannibals State Space
│   └─ zebra_search.py            # Zebra Search CSP
│
├─ datastructures/
│   ├─ b_tree_234.py              # 2-3-4 B-Tree
│   ├─ b_tree_presplit.py         # B-Tree with Preemptive Split
│   └─ b+_tree.py                 # B+ Tree
│
└─ README.md 

```