import unittest
from src.main import load_config

class TestMain(unittest.TestCase):
    def test_load_config(self):
        config = load_config('config/config.yaml')
        self.assertIsNotNone(config)
        self.assertIn('total_eth', config)

    def test_config_required_fields(self):
        """Test that all required configuration fields are present"""
        config = load_config('config/config.yaml')
        required_fields = [
            'total_eth',
            'max_slippage',
            'gas_limit',
            'dex_list'
        ]
        for field in required_fields:
            self.assertIn(field, config, f"Missing required config field: {field}")

    def test_config_values_validation(self):
        """Test that config values are within expected ranges"""
        config = load_config('config/config.yaml')
        self.assertGreater(config['total_eth'], 0, "total_eth should be positive")
        self.assertGreaterEqual(config['max_slippage'], 0, "max_slippage should be non-negative")
        self.assertLess(config['max_slippage'], 100, "max_slippage should be less than 100%")
        self.assertGreater(config['gas_limit'], 0, "gas_limit should be positive")
        self.assertIsInstance(config['dex_list'], list, "dex_list should be a list")
        self.assertGreater(len(config['dex_list']), 0, "dex_list should not be empty")

    def test_invalid_config_path(self):
        """Test handling of invalid config file path"""
        with self.assertRaises(FileNotFoundError):
            load_config('nonexistent_config.yaml')

if __name__ == '__main__':
    unittest.main()
