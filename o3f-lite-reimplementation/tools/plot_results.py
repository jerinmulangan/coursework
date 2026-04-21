import sys
import os
import pandas as pd
import matplotlib.pyplot as plt
import numpy as np

if len(sys.argv) < 2:
    print("Usage: python tools/plot_results.py <training_log.csv> [qtable.csv]")
    print("  training_log.csv: CSV with columns: episode,total_reward,success,steps,options_used,epsilon")
    print("  qtable.csv (optional): Q-table CSV for convergence analysis")
    sys.exit(1)

csv_file = sys.argv[1]
qtable_file = sys.argv[2] if len(sys.argv) > 2 else None

# Read training log
df = pd.read_csv(csv_file)

# Verify columns exist
required_cols = ['episode', 'total_reward', 'success', 'steps', 'options_used']
for col in required_cols:
    if col not in df.columns:
        print(f"Warning: Column '{col}' not found in CSV")

print(f"Loaded {len(df)} episodes from {csv_file}")

# Create output directory for graphs
output_dir = "training_graphs"
os.makedirs(output_dir, exist_ok=True)

# Set style
plt.style.use('seaborn-v0_8-darkgrid')
colors = plt.cm.Set2(np.linspace(0, 1, 10))

# ============================================================================
# 1. Total Episode Reward vs Episodes
# ============================================================================
fig, ax = plt.subplots(figsize=(12, 6))
ax.scatter(df['episode'], df['total_reward'], alpha=0.5, s=20, label='Episode Reward')
window = min(10, max(1, len(df) // 20))
if len(df) > window:
    df['rolling_reward'] = df['total_reward'].rolling(window=window, center=True).mean()
    ax.plot(df['episode'], df['rolling_reward'], color='red', linewidth=2, 
            label=f'Rolling Average ({window} episodes)')
ax.set_xlabel('Episode', fontsize=12)
ax.set_ylabel('Total Reward', fontsize=12)
ax.set_title('Total Episode Reward vs Episodes', fontsize=14, fontweight='bold')
ax.legend(fontsize=10)
ax.grid(True, alpha=0.3)
plt.tight_layout()
plt.savefig(os.path.join(output_dir, '1_reward_vs_episodes.png'), dpi=300)
print(f"Saved: {output_dir}/1_reward_vs_episodes.png")
plt.close()

# ============================================================================
# 2. Steps per Episode vs Episodes
# ============================================================================
fig, ax = plt.subplots(figsize=(12, 6))
ax.scatter(df['episode'], df['steps'], alpha=0.5, s=20, label='Steps per Episode', color=colors[1])
if len(df) > window:
    df['rolling_steps'] = df['steps'].rolling(window=window, center=True).mean()
    ax.plot(df['episode'], df['rolling_steps'], color='darkred', linewidth=2, 
            label=f'Rolling Average ({window} episodes)')
ax.set_xlabel('Episode', fontsize=12)
ax.set_ylabel('Steps', fontsize=12)
ax.set_title('Steps per Episode vs Episodes', fontsize=14, fontweight='bold')
ax.legend(fontsize=10)
ax.grid(True, alpha=0.3)
plt.tight_layout()
plt.savefig(os.path.join(output_dir, '2_steps_vs_episodes.png'), dpi=300)
print(f"Saved: {output_dir}/2_steps_vs_episodes.png")
plt.close()

# ============================================================================
# 3. Total Reward vs Steps per Episode
# ============================================================================
fig, ax = plt.subplots(figsize=(12, 6))
scatter = ax.scatter(df['steps'], df['total_reward'], c=df['episode'], cmap='viridis', 
                     alpha=0.6, s=30)
ax.set_xlabel('Steps per Episode', fontsize=12)
ax.set_ylabel('Total Reward', fontsize=12)
ax.set_title('Total Reward vs Steps per Episode', fontsize=14, fontweight='bold')
cbar = plt.colorbar(scatter, ax=ax)
cbar.set_label('Episode', fontsize=10)
ax.grid(True, alpha=0.3)
plt.tight_layout()
plt.savefig(os.path.join(output_dir, '3_reward_vs_steps.png'), dpi=300)
print(f"Saved: {output_dir}/3_reward_vs_steps.png")
plt.close()

# ============================================================================
# 4. Success Rate (10-episode moving average) vs Episodes
# ============================================================================
if 'success' in df.columns:
    fig, ax = plt.subplots(figsize=(12, 6))
    window_success = 10
    df['rolling_success'] = df['success'].rolling(window=window_success, center=True).mean()
    ax.plot(df['episode'], df['rolling_success'], color='green', linewidth=2.5, 
            label=f'{window_success}-Episode Moving Average')
    ax.scatter(df['episode'], df['success'], alpha=0.3, s=15, color='lightgreen', 
               label='Individual Episode')
    ax.fill_between(df['episode'], 0, df['rolling_success'], alpha=0.2, color='green')
    ax.set_xlabel('Episode', fontsize=12)
    ax.set_ylabel('Success Rate (0-1)', fontsize=12)
    ax.set_title('Success Rate (10-Episode Moving Average) vs Episodes', fontsize=14, fontweight='bold')
    ax.set_ylim([-0.05, 1.05])
    ax.legend(fontsize=10)
    ax.grid(True, alpha=0.3)
    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, '4_success_rate_vs_episodes.png'), dpi=300)
    print(f"Saved: {output_dir}/4_success_rate_vs_episodes.png")
    plt.close()
else:
    print("Warning: 'success' column not found; skipping success rate plot")

# ============================================================================
# 5. Q-value Convergence Analysis (if Q-table provided)
# ============================================================================
if qtable_file and os.path.exists(qtable_file):
    try:
        # Read Q-table
        qtable_df = pd.read_csv(qtable_file)
        print(f"Loaded Q-table from {qtable_file}")
        
        # Calculate Q-value statistics
        # Assume first column is state, remaining columns are Q-values for actions
        if len(qtable_df.columns) > 1:
            qvalues = qtable_df.iloc[:, 1:].values.flatten()
            qvalues = qvalues[~np.isnan(qvalues)]
            
            fig, ax = plt.subplots(figsize=(12, 6))
            
            # Plot distribution of Q-values
            ax.hist(qvalues, bins=50, alpha=0.7, color='steelblue', edgecolor='black')
            ax.axvline(np.mean(qvalues), color='red', linestyle='--', linewidth=2, 
                       label=f'Mean: {np.mean(qvalues):.2f}')
            ax.axvline(np.median(qvalues), color='orange', linestyle='--', linewidth=2, 
                       label=f'Median: {np.median(qvalues):.2f}')
            
            ax.set_xlabel('Q-Value', fontsize=12)
            ax.set_ylabel('Frequency', fontsize=12)
            ax.set_title('Q-Value Distribution (Final Q-Table)', fontsize=14, fontweight='bold')
            ax.legend(fontsize=10)
            ax.grid(True, alpha=0.3, axis='y')
            plt.tight_layout()
            plt.savefig(os.path.join(output_dir, '5_qvalue_distribution.png'), dpi=300)
            print(f"Saved: {output_dir}/5_qvalue_distribution.png")
            plt.close()
            
            # Calculate non-zero Q-values (learned states)
            learned_states = (qtable_df.iloc[:, 1:] != 0).any(axis=1).sum()
            print(f"\nQ-Table Statistics:")
            print(f"  Total states: {len(qtable_df)}")
            print(f"  States with learned Q-values: {learned_states}")
            print(f"  Q-value mean: {np.mean(qvalues):.4f}")
            print(f"  Q-value std: {np.std(qvalues):.4f}")
            print(f"  Q-value min: {np.min(qvalues):.4f}")
            print(f"  Q-value max: {np.max(qvalues):.4f}")
    except Exception as e:
        print(f"Warning: Could not load Q-table: {e}")
else:
    print("\nTo analyze Q-value convergence, provide a Q-table CSV file:")
    print("  python tools/plot_results.py <training_log.csv> <qtable.csv>")

# ============================================================================
# Summary Statistics
# ============================================================================
print("\n" + "="*60)
print("TRAINING SUMMARY STATISTICS")
print("="*60)
print(f"Total episodes: {len(df)}")
print(f"Average reward: {df['total_reward'].mean():.2f}")
print(f"Max reward: {df['total_reward'].max():.2f}")
print(f"Min reward: {df['total_reward'].min():.2f}")
print(f"Reward std dev: {df['total_reward'].std():.2f}")
print(f"\nAverage steps per episode: {df['steps'].mean():.2f}")
print(f"Max steps per episode: {df['steps'].max():.0f}")
print(f"Min steps per episode: {df['steps'].min():.0f}")

if 'success' in df.columns:
    success_rate = df['success'].mean()
    print(f"\nOverall success rate: {success_rate*100:.1f}%")
    print(f"Last 10 episodes success rate: {df['success'].tail(10).mean()*100:.1f}%")

print(f"\nAll graphs saved to: {os.path.abspath(output_dir)}")
print("="*60)
