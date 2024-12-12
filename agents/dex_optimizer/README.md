# DEX Swap Optimizer

## Overview

This project analyzes and optimizes decentralized exchange (DEX) swaps between SushiSwap and Uniswap on the Ethereum blockchain. The goal is to determine the optimal swap route to maximize efficiency and minimize slippage.

## Project Structure

```
dex_optimizer/
├── config/
│   └── config.yaml
├── src/
│   ├── __init__.py
│   ├── main.py
│   ├── market_data.py
│   ├── logical_reasoning.py
│   ├── optimization.py
│   ├── decision_tree.py
│   └── validation.py
├── tests/
│   └── test_main.py
├── venv/
├── startup.sh
└── README.md
```

## Setup Instructions

1. **Clone the Repository**:
   ```bash
   git clone <repository_url>
   cd dex_optimizer
   ```

2. **Run the Setup Script**:
   ```bash
   chmod +x setup_dex_optimizer.sh
   ./setup_dex_optimizer.sh
   ```

3. **Activate the Virtual Environment**:
   ```bash
   source venv/bin/activate
   ```

4. **Run the Optimizer**:
   ```bash
   ./startup.sh
   ```

## Usage

Configure the optimizer by editing `config/config.yaml` to set parameters such as total ETH to swap, optimization tolerances, and validation settings.

## Testing

Run the test suite using:

```bash
python -m unittest discover -s tests
```

## Best Practices

- Ensure all dependencies are up to date.
- Regularly update the configuration file based on market changes.
- Extend the validation framework with more comprehensive test cases.

## Contributing

Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License

This project is licensed under the MIT License.
