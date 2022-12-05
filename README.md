# FPV Terrain Classification Model
This is the tool for viewing the results from the overall model.

## Dependencies
Install all of the required dependencies using the command below, developed using Python 3.6 environment.
```bash
pip3 install -r requirements.txt
```

## Download Weights
Given size constraints the pretrained weights for each of the models has been hosted externally but can be downloaded from the links below, simply extract the weights into the corresponding folders.

### Environment (Indoor / Outdoor) Model
Extract to Models/EnvironmentClassifier  
https://livenorthumbriaac-my.sharepoint.com/:u:/g/personal/w17010536_northumbria_ac_uk/Efoc4mWInVxHr2WQTCaCakABtnFiYgAStrUnzSd6Ughp7A?e=Kf7a0k

### Floor Visible Indoor Model
Extract to Models/FloorClassifierIndoor  
https://livenorthumbriaac-my.sharepoint.com/:u:/g/personal/w17010536_northumbria_ac_uk/ET6XeBTXoVJGjM4BCzoefSAB5JDTHHYbf1M9xOY-xD3TgQ?e=foIYxx

### Floor Visible Outdoor Model
Extract to Models/FloorClassifierOutdoor  
https://livenorthumbriaac-my.sharepoint.com/:u:/g/personal/w17010536_northumbria_ac_uk/ESB8DKNPtJRGkXiCMhOBpw4BJ932XzM32M0lPmU3ARlS-w?e=3R1kog

### Terrain Indoor
Extract to Models/TerrainClassifierIndoor  
https://livenorthumbriaac-my.sharepoint.com/:u:/g/personal/w17010536_northumbria_ac_uk/EfYu8m-YtNBLseMS99yCyfYBnSUhU9iczudzxq370D-A1A?e=6vp36D

### Terrain Outdoor
Extract to Models/TerrainClassifierOutdoor  
https://livenorthumbriaac-my.sharepoint.com/:u:/g/personal/w17010536_northumbria_ac_uk/Eexm8s-mGEpJthXB6h0gGRwBYPQxdJpSF93Zo_otJvmaJw?e=ukRFXE 

## Usage
After satisfying that all the requirements are met, start a local flask server from the root of the project
```bash
flask run
```

Now open the index.html file in the root of the folder within your chosen browser to begin analysing.