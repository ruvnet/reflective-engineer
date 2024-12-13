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
            'rules',
            'optimization',
            'decision_tree',
            'validation'
        ]
        for field in required_fields:
            self.assertIn(field, config, f"Missing required config field: {field}")

    def test_config_values_validation(self):
        """Test that config values are within expected ranges"""
        config = load_config('config/config.yaml')
        self.assertGreater(config['total_eth'], 0, "total_eth should be positive")
        self.assertIsInstance(config['rules'], list, "rules should be a list")
        self.assertGreater(len(config['rules']), 0, "rules should not be empty")
        
        # Check optimization settings
        opt = config['optimization']
        self.assertGreaterEqual(opt['slippage_tolerance'], 0, "slippage_tolerance should be non-negative")
        self.assertLess(opt['slippage_tolerance'], 1, "slippage_tolerance should be less than 1")
        self.assertGreater(opt['max_gas_fees'], 0, "max_gas_fees should be positive")

    def test_invalid_config_path(self):
        """Test handling of invalid config file path"""
        with self.assertRaises(FileNotFoundError):
            load_config('nonexistent_config.yaml')

if __name__ == '__main__':
    unittest.main()
