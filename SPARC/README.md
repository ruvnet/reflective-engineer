# SPARC DNA Analysis Specification

This folder contains a SPARC specification that models a scenario of analyzing DNA sequences, identifying codons, detecting mutations, and reasoning about consistency and validity using a rule-based system.  

## Files

1. **dna_sequence_specification.sparc**  
   Contains the main SPARC specification with sorts, predicates, rules, and constraints. It demonstrates:
   - How to define nucleotides, codons, and amino acids.  
   - How to capture observed vs. reference nucleotides.  
   - Logic for identifying codons, detecting mutations, and labeling invalid codons.  
   - Constraints and rules that govern overall sequence consistency and validate the inferred results.

## Usage

To use this specification, you will:
1. Provide input facts (e.g., `observed/2`, `reference/2`, `known_codon/4`) for your specific DNA sequence of interest.  
2. Run a SPARC or ASP solver capable of parsing this specification. Provide the `.sparc` file and your additional input facts.  
3. Inspect answer sets that the solver produces, looking for derived predicates such as `identified_codon/2`, `mutation/1`, `sequence_consistent`, and `validated`.

Feel free to modify or extend the specification to suit additional requirements, like partial codons, alternative splicing scenarios, or more intricate mutation rules. 

## Notes

- The specification currently focuses on a single-stranded DNA model for simplicity, but includes placeholders (`complementary_pair/2`) in case you wish to expand it to a double-stranded framework.
- The structure is generalized so you can define any integer length for `position`, and add or remove constraints as necessary for your biology or bioinformatics use case.
