"""Setup configuration for SPARC CLI"""

from setuptools import setup, find_namespace_packages

setup(
    name="sparc-cli",
    version="0.1.0",
    packages=find_namespace_packages(include=['sparc*']),
    include_package_data=True,
    install_requires=[
        'click>=8.0.0',
        'ra-aid',
        'rich>=13.0.0',
        'pyyaml>=6.0',
    ],
    entry_points={
        'console_scripts': [
            'sparc=sparc.cli:cli',
        ],
    },
    author="AI Christianson",
    author_email="ai.christianson@christianson.ai",
    description="SPARC CLI - Systematic Programming and Refinement Companion",
    long_description=open('sparc/README.md').read(),
    long_description_content_type="text/markdown",
    url="https://github.com/ai-christianson/sparc-cli",
    classifiers=[
        "Development Status :: 3 - Alpha",
        "Intended Audience :: Developers",
        "License :: OSI Approved :: Apache Software License",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Topic :: Software Development :: Libraries :: Python Modules",
    ],
    python_requires=">=3.8",
)