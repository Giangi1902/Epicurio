import json
import glob
import os

# Function to merge all JSON files in a given directory into a single JSON file
def merge_json_files(input_directory, output_file_path):
    merged_data = []

    # Get a list of all JSON files in the input directory
    json_files = glob.glob(os.path.join(input_directory, "*.json"))

    for file_path in json_files:
        with open(file_path, 'r', encoding='utf-8') as file:
            data = json.load(file)
            merged_data.extend(data)  # Append the data from each file to the list

    # Write the merged data to a new JSON file
    with open(output_file_path, 'w', encoding='utf-8') as output_file:
        json.dump(merged_data, output_file, ensure_ascii=False, indent=2)

# Example usage
input_directory = './output'  # Directory containing the JSON files
output_merged_file = './output/merged_products.json'  # Output merged JSON file

# Call the function to merge JSON files
merge_json_files(input_directory, output_merged_file)

output_merged_file
