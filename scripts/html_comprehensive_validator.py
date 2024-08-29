import subprocess
import re
import sys
import os

VNU_PATH = os.path.expanduser("~/software/nu_html_checker/vnu-runtime-image/bin/vnu")

def run_vnu(file_path):
    try:
        result = subprocess.run([VNU_PATH, '--format', 'text', file_path],
                                capture_output=True, text=True, check=True)
        return False, result.stdout  # No errors or warnings
    except subprocess.CalledProcessError as e:
        return True, e.stdout + e.stderr  # Errors or warnings found

def check_trailing_slashes(file_path):
    with open(file_path, 'r') as file:
        content = file.read()

    void_elements = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']
    pattern = r'<(' + '|'.join(void_elements) + r')[^>]*\/>'

    matches = list(re.finditer(pattern, content))
    output = []
    for match in matches:
        line_number = content[:match.start()].count('\n') + 1
        output.append(f"Info: Trailing slash on void element has no effect and interacts badly with unquoted attribute values. Line {line_number}: {match.group()}")

    return bool(matches), '\n'.join(output)

def validate_file(file_path):
    print(f"\nValidating {file_path}:")
    errors_found = False

    vnu_errors, vnu_output = run_vnu(file_path)
    if vnu_errors:
        print("vnu validation errors/warnings:")
        print(vnu_output)
    errors_found |= vnu_errors

    slash_errors, slash_output = check_trailing_slashes(file_path)
    if slash_errors:
        print("Custom check results:")
        print(slash_output)
    errors_found |= slash_errors

    if not errors_found:
        print(f"No issues found in {file_path}")

    return errors_found

def main(file_paths):
    if not os.path.exists(VNU_PATH):
        print(f"Error: vnu not found at {VNU_PATH}")
        sys.exit(1)

    any_errors = False

    for file_path in file_paths:
        if not os.path.exists(file_path):
            print(f"Error: File not found: {file_path}")
            any_errors = True
            continue

        any_errors |= validate_file(file_path)

    if any_errors:
        print("\nValidation completed. Issues were found in one or more files.")
        sys.exit(1)
    else:
        print("\nValidation completed. No issues were found in any files.")
        sys.exit(0)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python html_comprehensive_validator.py <html_file1> [<html_file2> ...]")
        sys.exit(1)
    main(sys.argv[1:])
