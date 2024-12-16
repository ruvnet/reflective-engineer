import pytest
from ra_aid.tools.memory import (
    _global_memory,
    get_memory_value,
    emit_research_subtask,
    emit_key_facts,
    delete_key_facts,
    emit_key_snippets,
    delete_key_snippets,
    emit_related_files,
    get_related_files
)

@pytest.fixture
def reset_memory():
    """Reset global memory before each test"""
    _global_memory['key_facts'] = {}
    _global_memory['key_fact_id_counter'] = 0
    _global_memory['key_snippets'] = {}
    _global_memory['key_snippet_id_counter'] = 0
    _global_memory['research_notes'] = []
    _global_memory['plans'] = []
    _global_memory['tasks'] = []
    _global_memory['research_subtasks'] = []
    _global_memory['related_files'] = set()
    yield
    # Clean up after test
    _global_memory['key_facts'] = {}
    _global_memory['key_fact_id_counter'] = 0
    _global_memory['key_snippets'] = {}
    _global_memory['key_snippet_id_counter'] = 0
    _global_memory['research_notes'] = []
    _global_memory['plans'] = []
    _global_memory['tasks'] = []
    _global_memory['research_subtasks'] = []

def test_emit_key_facts_single_fact(reset_memory):
    """Test emitting a single key fact using emit_key_facts"""
    # Test with single fact
    result = emit_key_facts.invoke({"facts": ["First fact"]})
    assert result == "Facts stored."
    assert _global_memory['key_facts'][0] == "First fact"
    assert _global_memory['key_fact_id_counter'] == 1

def test_delete_key_facts_single_fact(reset_memory):
    """Test deleting a single key fact using delete_key_facts"""
    # Add a fact
    emit_key_facts.invoke({"facts": ["Test fact"]})
    
    # Delete the fact
    result = delete_key_facts.invoke({"fact_ids": [0]})
    assert result == "Facts deleted."
    assert 0 not in _global_memory['key_facts']

def test_delete_key_facts_invalid(reset_memory):
    """Test deleting non-existent facts returns empty list"""
    # Try to delete non-existent fact
    result = delete_key_facts.invoke({"fact_ids": [999]})
    assert result == "Facts deleted."
    
    # Add and delete a fact, then try to delete it again
    emit_key_facts.invoke({"facts": ["Test fact"]})
    delete_key_facts.invoke({"fact_ids": [0]})
    result = delete_key_facts.invoke({"fact_ids": [0]})
    assert result == "Facts deleted."

def test_get_memory_value_key_facts(reset_memory):
    """Test get_memory_value with key facts dictionary"""
    # Empty key facts should return empty string
    assert get_memory_value('key_facts') == ""
    
    # Add some facts
    emit_key_facts.invoke({"facts": ["First fact", "Second fact"]})
    
    # Should return markdown formatted list
    expected = "## 🔑 Key Fact #0\n\nFirst fact\n\n## 🔑 Key Fact #1\n\nSecond fact"
    assert get_memory_value('key_facts') == expected

def test_get_memory_value_other_types(reset_memory):
    """Test get_memory_value remains compatible with other memory types"""
    # Add some research notes
    _global_memory['research_notes'].append("Note 1")
    _global_memory['research_notes'].append("Note 2")
    
    assert get_memory_value('research_notes') == "Note 1\nNote 2"
    
    # Test with empty list
    assert get_memory_value('plans') == ""
    
    # Test with non-existent key
    assert get_memory_value('nonexistent') == ""

def test_emit_key_facts(reset_memory):
    """Test emitting multiple key facts at once"""
    # Test emitting multiple facts
    facts = ["First fact", "Second fact", "Third fact"]
    result = emit_key_facts.invoke({"facts": facts})
    
    # Verify return message
    assert result == "Facts stored."
    
    # Verify facts stored in memory with correct IDs
    assert _global_memory['key_facts'][0] == "First fact"
    assert _global_memory['key_facts'][1] == "Second fact"
    assert _global_memory['key_facts'][2] == "Third fact"
    
    # Verify counter incremented correctly
    assert _global_memory['key_fact_id_counter'] == 3

def test_delete_key_facts(reset_memory):
    """Test deleting multiple key facts"""
    # Add some test facts
    emit_key_facts.invoke({"facts": ["First fact", "Second fact", "Third fact"]})
    
    # Test deleting mix of existing and non-existing IDs
    result = delete_key_facts.invoke({"fact_ids": [0, 1, 999]})
    
    # Verify success message
    assert result == "Facts deleted."
    
    # Verify correct facts removed from memory
    assert 0 not in _global_memory['key_facts']
    assert 1 not in _global_memory['key_facts']
    assert 2 in _global_memory['key_facts']  # ID 2 should remain
    assert _global_memory['key_facts'][2] == "Third fact"

def test_emit_key_snippets(reset_memory):
    """Test emitting multiple code snippets at once"""
    # Test snippets with and without descriptions
    snippets = [
        {
            "filepath": "test.py",
            "line_number": 10,
            "snippet": "def test():\n    pass",
            "description": "Test function"
        },
        {
            "filepath": "main.py",
            "line_number": 20,
            "snippet": "print('hello')",
            "description": None
        }
    ]
    
    # Emit snippets
    result = emit_key_snippets.invoke({"snippets": snippets})
    
    # Verify return message
    assert result == "Snippets stored."
    
    # Verify snippets stored correctly
    assert _global_memory['key_snippets'][0] == snippets[0]
    assert _global_memory['key_snippets'][1] == snippets[1]
    
    # Verify counter incremented correctly
    assert _global_memory['key_snippet_id_counter'] == 2

def test_delete_key_snippets(reset_memory):
    """Test deleting multiple code snippets"""
    # Add test snippets
    snippets = [
        {
            "filepath": "test1.py",
            "line_number": 1,
            "snippet": "code1",
            "description": None
        },
        {
            "filepath": "test2.py",
            "line_number": 2,
            "snippet": "code2",
            "description": None
        },
        {
            "filepath": "test3.py",
            "line_number": 3,
            "snippet": "code3",
            "description": None
        }
    ]
    emit_key_snippets.invoke({"snippets": snippets})
    
    # Test deleting mix of valid and invalid IDs
    result = delete_key_snippets.invoke({"snippet_ids": [0, 1, 999]})
    
    # Verify success message
    assert result == "Snippets deleted."
    
    # Verify correct snippets removed
    assert 0 not in _global_memory['key_snippets']
    assert 1 not in _global_memory['key_snippets']
    assert 2 in _global_memory['key_snippets']
    assert _global_memory['key_snippets'][2]['filepath'] == "test3.py"

def test_delete_key_snippets_empty(reset_memory):
    """Test deleting snippets with empty ID list"""
    # Add a test snippet
    snippet = {
        "filepath": "test.py",
        "line_number": 1,
        "snippet": "code",
        "description": None
    }
    emit_key_snippets.invoke({"snippets": [snippet]})
    
    # Test with empty list
    result = delete_key_snippets.invoke({"snippet_ids": []})
    assert result == "Snippets deleted."
    
    # Verify snippet still exists
    assert 0 in _global_memory['key_snippets']

def test_emit_related_files_basic(reset_memory):
    """Test basic adding of files"""
    # Test adding single file
    result = emit_related_files.invoke({"files": ["test.py"]})
    assert result == "Files noted."
    assert get_related_files() == {"test.py"}
    
    # Test adding multiple files
    result = emit_related_files.invoke({"files": ["main.py", "utils.py"]})
    assert result == "Files noted."
    assert get_related_files() == {"test.py", "main.py", "utils.py"}

def test_get_related_files_empty(reset_memory):
    """Test getting related files when none added"""
    assert get_related_files() == set()

def test_emit_related_files_duplicates(reset_memory):
    """Test that duplicate files are handled correctly"""
    # Add initial files
    result = emit_related_files.invoke({"files": ["test.py", "main.py"]})
    assert result == "Files noted."
    assert get_related_files() == {"test.py", "main.py"}
    
    # Try adding duplicates
    result = emit_related_files.invoke({"files": ["test.py", "main.py", "test.py"]})
    assert result == "Files noted."
    # Set should still only contain unique entries
    assert get_related_files() == {"test.py", "main.py"}

def test_key_snippets_integration(reset_memory):
    """Integration test for key snippets functionality"""
    # Initial snippets to add
    snippets = [
        {
            "filepath": "file1.py",
            "line_number": 10,
            "snippet": "def func1():\n    pass",
            "description": "First function"
        },
        {
            "filepath": "file2.py",
            "line_number": 20,
            "snippet": "def func2():\n    return True",
            "description": "Second function"
        },
        {
            "filepath": "file3.py",
            "line_number": 30,
            "snippet": "class TestClass:\n    pass",
            "description": "Test class"
        }
    ]
    
    # Add all snippets
    result = emit_key_snippets.invoke({"snippets": snippets})
    assert result == "Snippets stored."
    assert _global_memory['key_snippet_id_counter'] == 3
    
    # Verify all snippets were stored correctly
    assert len(_global_memory['key_snippets']) == 3
    assert _global_memory['key_snippets'][0] == snippets[0]
    assert _global_memory['key_snippets'][1] == snippets[1]
    assert _global_memory['key_snippets'][2] == snippets[2]
    
    # Delete some but not all snippets (0 and 2)
    result = delete_key_snippets.invoke({"snippet_ids": [0, 2]})
    assert result == "Snippets deleted."
    
    # Verify remaining snippet is intact
    assert len(_global_memory['key_snippets']) == 1
    assert 1 in _global_memory['key_snippets']
    assert _global_memory['key_snippets'][1] == snippets[1]
    
    # Counter should remain unchanged after deletions
    assert _global_memory['key_snippet_id_counter'] == 3
    
    # Add new snippet to verify counter continues correctly
    new_snippet = {
        "filepath": "file4.py",
        "line_number": 40,
        "snippet": "def func4():\n    return False",
        "description": "Fourth function"
    }
    result = emit_key_snippets.invoke({"snippets": [new_snippet]})
    assert result == "Snippets stored."
    assert _global_memory['key_snippet_id_counter'] == 4
    
    # Delete remaining snippets
    result = delete_key_snippets.invoke({"snippet_ids": [1, 3]})
    assert result == "Snippets deleted."
    
    # Verify all snippets are gone
    assert len(_global_memory['key_snippets']) == 0
    
    # Counter should still maintain its value
    assert _global_memory['key_snippet_id_counter'] == 4

def test_emit_research_subtask(reset_memory):
    """Test emitting research subtasks"""
    # Test adding a research subtask
    subtask = "Research Python async patterns"
    result = emit_research_subtask(subtask)
    
    # Verify return message
    assert result == "Subtask added."
    
    # Verify it was stored in memory
    assert len(_global_memory['research_subtasks']) == 1
    assert _global_memory['research_subtasks'][0] == subtask
