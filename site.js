var linkbox = document.getElementById("link_box");
var loadingBox = document.getElementById("loading_banner");
var loadingText = document.getElementById("loading_text");
var videoBanner = document.getElementById("video_banner");
var videoPlayer = document.getElementById("video_player");
var sliderContainer = document.getElementById("slider_container");
var youtubeBanner = document.getElementById("youtube_banner");

var outsideBox = document.getElementById("result_box_outdoor")
var insideBox = document.getElementById("result_box_indoor")
var stairBox = document.getElementById("result_box_stairs")

var wood = document.getElementById("wood_box")
var carpet = document.getElementById("carpet_box")
var asphalt = document.getElementById("asphalt_box")
var tile = document.getElementById("tile_box")
var gravel = document.getElementById("gravel_box")
var concrete = document.getElementById("concrete_box")
var grass = document.getElementById("grass_box")
var sand = document.getElementById("sand_box")
var snow = document.getElementById("snow_box")
var woodland = document.getElementById("woodland_box")

var playButton = document.getElementById("play_button")

var url = "http://127.0.0.1:5000/";

var frameCounter = null;

var videoName = "";
var frameResults = [];
var frameRate = 0;
var totalFrames = 0;
var currentAnalysedFrame = 0;

window.onload = () => {
    const checkScreenSize = () => {
        const width = window.screen.width * window.devicePixelRatio
        const height = window.screen.height * window.devicePixelRatio;
    
        if(width === 3440 && height === 1440){
            return;
        }
    
        if(width !== 1920 && height !== 1080){
            alert("This application is made for 1920x1080 displays so may appear glitchy on your display.")
        } 
    }
    
    checkScreenSize();
}

var downloadYoutube = async () => {
    toggleLoading(true, "Downloading Youtube Video")
    return await fetch(url+"youtube", {
        method: "POST",
        headers: {
            "Accept" : "application/json",
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({
            link: linkbox.value
        })
    }).then((response) => response.json())
    .then((data) => {
        if(data.Success){
            videoName = data.Filename;
            toggleLoading(true, "Analysing Video");
            analyseVideo();
        }
    })
}

var analyseVideo = async () => {
    return await fetch(url+"analyse", {
        method: "GET",
        headers: {
            "Accept" : "application/json",
            "Content-Type" : "application/json"
        },
    }).then((response) => response.json())
    .then((data) => {
        frameRate = parseFloat(data.FrameRate);
        frameResults = data.Results;
        totalFrames = data.TotalFrames;
        toggleLoading(false);
        toggleVideoBox();
    })
}

var toggleLoading = (loading, dialog="") => {
    if(loading){
        loadingBox.style.display = "flex";
        loadingText.innerText = dialog;
    } else {
        loadingBox.style.display = "none";
    }
}

var toggleVideoBox = () => {
    youtubeBanner.style.display = "none";
    videoBanner.style.display = "flex";
    videoPlayer.src = "uploads/"+videoName;
}

const beginVideo = () => {
    playButton.style.display = "none";
    videoPlayer.play();
    newFrame();
}

const newFrame = () => {
    frame = 1;
    framePerMS = 1000 / frameRate;
    showResults(frameResults[currentAnalysedFrame]);
    frameCounter = setInterval(() => {
        if(frame % 30 == 0){
            console.log(frameResults[currentAnalysedFrame]);
            showResults(frameResults[currentAnalysedFrame]);
            currentAnalysedFrame++;
        }
        frame++;
    }, framePerMS)
}

videoPlayer.onended = () => {
    console.log("Clearing Counter");
    clearInterval(frameCounter);
}

const showResults = (results) => {
    if(results != undefined){
        if(results[0] != undefined) {
            if (results[0] === "Indoor") showIndoorBox()
            else showOutdoorBox()
        }

        if (results[1] != undefined)
            if(results[1] === "Stairs") showStairBox()
        
        if(results[2] != undefined){
            labels = [{label: "Wood", comp: wood}, {label: "Carpet", comp: carpet}, {label: "Tiles", comp: tile}, {label: "Asphalt", comp: asphalt}, { label: "Grass", comp: grass}, {label: "ConcreteBlock", comp: concrete }, {label: "Snow", comp: snow}, {label: "Sand", comp: sand}, {label:"Gravel", comp: gravel}, {label: "Woodland", comp: woodland}]
            for(var i = 0; i < labels.length; i++){
                console.log("Trying: "+labels[i].label)
                if(labels[i].label === results[2].Max){
                    console.log("Showing: "+results[2].Max)
                    labels[i].comp.style.opacity = "1"
                    labels[i].comp.style.transform = "scale(1.2)"
                } else {
                    labels[i].comp.style.opacity = "0.3"
                    labels[i].comp.style.transform = "scale(1)"
                }
            }
        }
    }
}

const showIndoorBox = () => {
    insideBox.style.opacity = "1";
    insideBox.style.transform = "scale(1)";
    outsideBox.style.opacity = "0.3";
    outsideBox.style.transform = "scale(0.8)";
    stairBox.style.opacity = "0.3"
    stairBox.style.transform = "scale(0.8)";
}

const showOutdoorBox = () => {
    insideBox.style.opacity = "0.3";
    insideBox.style.transform = "scale(0.8)";
    outsideBox.style.opacity = "1";
    outsideBox.style.transform = "scale(1)";
    stairBox.style.opacity = "0.3"
    stairBox.style.transform = "scale(0.8)";
}

const showStairBox = () => {
    stairBox.style.opacity = "1"
    stairBox.style.transform = "scale(1)";
    insideBox.style.opacity = "0.3"
    insideBox.style.transform = "scale(0.8)";
    outsideBox.style.opacity = "0.3"
    outsideBox.style.transform = "scale(0.8)";
}

/*
[
    [
        "Outdoor",
        "FloorVisible",
        {
            "Asphalt": "0.012635019",
            "ConcreteBlock": "0.00019175274",
            "Grass": "0.9870662",
            "Gravel": "8.432732e-05",
            "Max": "Grass",
            "Sand": "6.3291685e-07",
            "Snow": "1.076617e-07",
            "Woodland": "2.1828258e-05"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Outdoor",
        "FloorVisible",
        {
            "Asphalt": "0.21000108",
            "ConcreteBlock": "0.038075212",
            "Grass": "0.743593",
            "Gravel": "0.005739184",
            "Max": "Grass",
            "Sand": "5.230572e-05",
            "Snow": "7.8923895e-06",
            "Woodland": "0.0025313112"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Outdoor",
        "FloorVisible",
        {
            "Asphalt": "0.06330422",
            "ConcreteBlock": "0.003614268",
            "Grass": "0.9323139",
            "Gravel": "0.00061958923",
            "Max": "Grass",
            "Sand": "1.3206953e-05",
            "Snow": "5.554409e-07",
            "Woodland": "0.00013431387"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Outdoor",
        "FloorVisible",
        {
            "Asphalt": "0.09131593",
            "ConcreteBlock": "0.0043495684",
            "Grass": "0.9026068",
            "Gravel": "0.0015019254",
            "Max": "Grass",
            "Sand": "1.307058e-05",
            "Snow": "8.7030185e-07",
            "Woodland": "0.00021184704"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Outdoor",
        "FloorVisible",
        {
            "Asphalt": "0.15104343",
            "ConcreteBlock": "0.009426219",
            "Grass": "0.8363282",
            "Gravel": "0.0027243963",
            "Max": "Grass",
            "Sand": "0.000104411396",
            "Snow": "3.6112922e-06",
            "Woodland": "0.00036975453"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Outdoor",
        "FloorVisible",
        {
            "Asphalt": "0.02802951",
            "ConcreteBlock": "0.0006260371",
            "Grass": "0.9710268",
            "Gravel": "0.00016906571",
            "Max": "Grass",
            "Sand": "4.778754e-06",
            "Snow": "5.481886e-07",
            "Woodland": "0.0001432112"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Outdoor",
        "FloorVisible",
        {
            "Asphalt": "0.013033995",
            "ConcreteBlock": "8.941311e-05",
            "Grass": "0.9854616",
            "Gravel": "0.0002671068",
            "Max": "Grass",
            "Sand": "1.23437585e-05",
            "Snow": "7.693251e-08",
            "Woodland": "0.0011353815"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Outdoor",
        "FloorVisible",
        {
            "Asphalt": "0.29826373",
            "ConcreteBlock": "0.19184504",
            "Grass": "0.48496342",
            "Gravel": "0.023181165",
            "Max": "Grass",
            "Sand": "0.00092793966",
            "Snow": "1.25706865e-05",
            "Woodland": "0.00080607686"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Outdoor",
        "FloorVisible",
        {
            "Asphalt": "0.18260646",
            "ConcreteBlock": "0.023084491",
            "Grass": "0.7846512",
            "Gravel": "0.0092335325",
            "Max": "Grass",
            "Sand": "0.00012802953",
            "Snow": "2.4109919e-05",
            "Woodland": "0.00027219002"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Outdoor",
        "FloorVisible",
        {
            "Asphalt": "0.5431669",
            "ConcreteBlock": "0.09852988",
            "Grass": "0.3437243",
            "Gravel": "0.014484096",
            "Max": "Asphalt",
            "Sand": "1.4339057e-05",
            "Snow": "6.3764037e-06",
            "Woodland": "7.415492e-05"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Outdoor",
        "FloorVisible",
        {
            "Asphalt": "0.8128215",
            "ConcreteBlock": "0.103582345",
            "Grass": "0.07442831",
            "Gravel": "0.0091158785",
            "Max": "Asphalt",
            "Sand": "2.7935635e-06",
            "Snow": "3.6385313e-06",
            "Woodland": "4.547026e-05"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Outdoor",
        "FloorVisible",
        {
            "Asphalt": "0.24280348",
            "ConcreteBlock": "0.083748184",
            "Grass": "0.6652522",
            "Gravel": "0.008170254",
            "Max": "Grass",
            "Sand": "2.873534e-06",
            "Snow": "1.9440931e-06",
            "Woodland": "2.1024518e-05"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Outdoor",
        "FloorVisible",
        {
            "Asphalt": "0.8195122",
            "ConcreteBlock": "0.014320249",
            "Grass": "0.16222674",
            "Gravel": "0.0038575612",
            "Max": "Asphalt",
            "Sand": "6.9576527e-06",
            "Snow": "6.9535366e-07",
            "Woodland": "7.56316e-05"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Outdoor",
        "FloorVisible",
        {
            "Asphalt": "0.7298151",
            "ConcreteBlock": "0.000321133",
            "Grass": "0.26967877",
            "Gravel": "0.00017398133",
            "Max": "Asphalt",
            "Sand": "3.643429e-07",
            "Snow": "1.6976474e-08",
            "Woodland": "1.0671501e-05"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Outdoor",
        "FloorVisible",
        {
            "Asphalt": "0.11729703",
            "ConcreteBlock": "0.0007557197",
            "Grass": "0.87873745",
            "Gravel": "0.0016458847",
            "Max": "Grass",
            "Sand": "2.3750277e-05",
            "Snow": "1.2515058e-06",
            "Woodland": "0.0015388553"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Outdoor",
        "FloorVisible",
        {
            "Asphalt": "0.07372386",
            "ConcreteBlock": "0.0004081564",
            "Grass": "0.920891",
            "Gravel": "0.0038429012",
            "Max": "Grass",
            "Sand": "2.5363388e-05",
            "Snow": "1.8236597e-06",
            "Woodland": "0.0011067825"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Outdoor",
        "FloorVisible",
        {
            "Asphalt": "0.344749",
            "ConcreteBlock": "0.0008056766",
            "Grass": "0.6283123",
            "Gravel": "0.0069981925",
            "Max": "Grass",
            "Sand": "3.0460888e-05",
            "Snow": "1.4911593e-06",
            "Woodland": "0.019102808"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Outdoor",
        "FloorVisible",
        {
            "Asphalt": "0.83812535",
            "ConcreteBlock": "0.028736949",
            "Grass": "0.12758255",
            "Gravel": "0.005260719",
            "Max": "Asphalt",
            "Sand": "2.8022414e-06",
            "Snow": "2.8117984e-06",
            "Woodland": "0.00028884684"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Outdoor",
        "FloorVisible",
        {
            "Asphalt": "0.91483134",
            "ConcreteBlock": "0.038530145",
            "Grass": "0.03917389",
            "Gravel": "0.0069050905",
            "Max": "Asphalt",
            "Sand": "3.59536e-06",
            "Snow": "2.7427966e-06",
            "Woodland": "0.0005532233"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Outdoor",
        "FloorVisible",
        {
            "Asphalt": "0.9074749",
            "ConcreteBlock": "0.025430258",
            "Grass": "0.051688902",
            "Gravel": "0.01467138",
            "Max": "Asphalt",
            "Sand": "2.2894457e-05",
            "Snow": "1.2364186e-05",
            "Woodland": "0.00069926644"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Outdoor",
        "FloorVisible",
        {
            "Asphalt": "0.921434",
            "ConcreteBlock": "0.012907524",
            "Grass": "0.060760383",
            "Gravel": "0.004198049",
            "Max": "Asphalt",
            "Sand": "6.8524373e-06",
            "Snow": "6.269169e-06",
            "Woodland": "0.0006869201"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Outdoor",
        "FloorVisible",
        {
            "Asphalt": "0.91498905",
            "ConcreteBlock": "0.021342725",
            "Grass": "0.046329718",
            "Gravel": "0.016023243",
            "Max": "Asphalt",
            "Sand": "3.4390974e-05",
            "Snow": "3.3026827e-05",
            "Woodland": "0.0012477824"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Outdoor",
        "FloorNotVisible"
    ],
    [
        "Outdoor",
        "FloorNotVisible"
    ],
    [
        "Outdoor",
        "FloorNotVisible"
    ],
    [
        "Outdoor",
        "FloorNotVisible"
    ],
    [
        "Outdoor",
        "FloorNotVisible"
    ],
    [
        "Outdoor",
        "FloorNotVisible"
    ],
    [
        "Outdoor",
        "FloorVisible",
        {
            "Asphalt": "0.92381144",
            "ConcreteBlock": "0.016783873",
            "Grass": "0.0019125878",
            "Gravel": "0.0031774014",
            "Max": "Asphalt",
            "Sand": "0.00052600075",
            "Snow": "0.053746868",
            "Woodland": "4.187387e-05"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Outdoor",
        "FloorVisible",
        {
            "Asphalt": "0.00042858114",
            "ConcreteBlock": "9.787867e-06",
            "Grass": "2.7618444e-07",
            "Gravel": "9.902686e-08",
            "Max": "Snow",
            "Sand": "6.983975e-08",
            "Snow": "0.99956113",
            "Woodland": "5.5021397e-11"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Outdoor",
        "FloorVisible",
        {
            "Asphalt": "0.8276875",
            "ConcreteBlock": "0.08270415",
            "Grass": "0.00047272354",
            "Gravel": "0.003669618",
            "Max": "Asphalt",
            "Sand": "0.00024307235",
            "Snow": "0.08522211",
            "Woodland": "8.268621e-07"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Outdoor",
        "FloorVisible",
        {
            "Asphalt": "0.4560591",
            "ConcreteBlock": "0.44746828",
            "Grass": "0.027345302",
            "Gravel": "0.0479518",
            "Max": "Asphalt",
            "Sand": "0.0018899671",
            "Snow": "0.016190113",
            "Woodland": "0.003095447"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Outdoor",
        "FloorVisible",
        {
            "Asphalt": "0.75303775",
            "ConcreteBlock": "0.20142531",
            "Grass": "0.018476902",
            "Gravel": "0.026810523",
            "Max": "Asphalt",
            "Sand": "3.331062e-05",
            "Snow": "2.665516e-05",
            "Woodland": "0.00018954344"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Outdoor",
        "FloorVisible",
        {
            "Asphalt": "0.80344564",
            "ConcreteBlock": "0.13242334",
            "Grass": "0.020702692",
            "Gravel": "0.042957507",
            "Max": "Asphalt",
            "Sand": "0.0001572752",
            "Snow": "5.2137575e-06",
            "Woodland": "0.0003083954"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Outdoor",
        "FloorVisible",
        {
            "Asphalt": "0.3753548",
            "ConcreteBlock": "0.6190974",
            "Grass": "0.00038255015",
            "Gravel": "0.0045421976",
            "Max": "ConcreteBlock",
            "Sand": "0.0005307815",
            "Snow": "5.4577864e-05",
            "Woodland": "3.7710495e-05"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Outdoor",
        "FloorVisible",
        {
            "Asphalt": "0.009999846",
            "ConcreteBlock": "0.9889247",
            "Grass": "0.000101815654",
            "Gravel": "0.00044814294",
            "Max": "ConcreteBlock",
            "Sand": "5.729892e-06",
            "Snow": "0.0004887636",
            "Woodland": "3.100524e-05"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Outdoor",
        "FloorNotVisible"
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.28611314",
            "Max": "Wood",
            "Tiles": "0.004909142",
            "Wood": "0.70897776"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.42143893",
            "Max": "Wood",
            "Tiles": "0.029530713",
            "Wood": "0.5490303"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.8266136",
            "Max": "Carpet",
            "Tiles": "0.018517109",
            "Wood": "0.15486927"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.4910077",
            "Max": "Carpet",
            "Tiles": "0.106937096",
            "Wood": "0.40205523"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.6942762",
            "Max": "Carpet",
            "Tiles": "0.16421506",
            "Wood": "0.14150879"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.47781032",
            "Max": "Carpet",
            "Tiles": "0.33074874",
            "Wood": "0.19144094"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.7227638",
            "Max": "Carpet",
            "Tiles": "0.03912041",
            "Wood": "0.23811585"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.56176376",
            "Max": "Carpet",
            "Tiles": "0.058652416",
            "Wood": "0.37958384"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.38136187",
            "Max": "Wood",
            "Tiles": "0.04058964",
            "Wood": "0.57804847"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.45498517",
            "Max": "Wood",
            "Tiles": "0.032809235",
            "Wood": "0.51220566"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.23489399",
            "Max": "Wood",
            "Tiles": "0.031663317",
            "Wood": "0.73344266"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.333384",
            "Max": "Wood",
            "Tiles": "0.119543545",
            "Wood": "0.5470724"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.26401076",
            "Max": "Wood",
            "Tiles": "0.021009754",
            "Wood": "0.71497947"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.67282635",
            "Max": "Carpet",
            "Tiles": "0.10362309",
            "Wood": "0.22355057"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.9842525",
            "Max": "Carpet",
            "Tiles": "0.0007143322",
            "Wood": "0.015033133"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.9870985",
            "Max": "Carpet",
            "Tiles": "0.00045882893",
            "Wood": "0.012442681"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.99792373",
            "Max": "Carpet",
            "Tiles": "5.9838054e-05",
            "Wood": "0.002016409"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.92819536",
            "Max": "Carpet",
            "Tiles": "0.028933054",
            "Wood": "0.042871613"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.9765241",
            "Max": "Carpet",
            "Tiles": "0.00041510366",
            "Wood": "0.023060728"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.3221491",
            "Max": "Wood",
            "Tiles": "0.024820562",
            "Wood": "0.65303034"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.20990539",
            "Max": "Wood",
            "Tiles": "0.03478887",
            "Wood": "0.7553057"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.4981632",
            "Max": "Carpet",
            "Tiles": "0.16419056",
            "Wood": "0.33764625"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.41313112",
            "Max": "Wood",
            "Tiles": "0.09681545",
            "Wood": "0.49005336"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.0220215",
            "Max": "Wood",
            "Tiles": "0.0038196987",
            "Wood": "0.97415876"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.094433516",
            "Max": "Wood",
            "Tiles": "0.02009917",
            "Wood": "0.88546735"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.2989822",
            "Max": "Wood",
            "Tiles": "0.085088216",
            "Wood": "0.61592954"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.48231846",
            "Max": "Carpet",
            "Tiles": "0.19613272",
            "Wood": "0.32154885"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.28158358",
            "Max": "Wood",
            "Tiles": "0.050629944",
            "Wood": "0.6677865"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.08160122",
            "Max": "Wood",
            "Tiles": "0.01406363",
            "Wood": "0.9043352"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.43363628",
            "Max": "Wood",
            "Tiles": "0.062026262",
            "Wood": "0.50433743"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.23073754",
            "Max": "Wood",
            "Tiles": "0.031511016",
            "Wood": "0.7377514"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.2170589",
            "Max": "Wood",
            "Tiles": "0.025987597",
            "Wood": "0.75695354"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.34409544",
            "Max": "Wood",
            "Tiles": "0.027695226",
            "Wood": "0.62820935"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.18812051",
            "Max": "Wood",
            "Tiles": "0.020588743",
            "Wood": "0.79129076"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.02286575",
            "Max": "Wood",
            "Tiles": "0.0032997332",
            "Wood": "0.9738346"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.092571974",
            "Max": "Wood",
            "Tiles": "0.14175878",
            "Wood": "0.7656692"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.111584",
            "Max": "Wood",
            "Tiles": "0.20091784",
            "Wood": "0.68749815"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.013910207",
            "Max": "Wood",
            "Tiles": "0.044788733",
            "Wood": "0.9413011"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.03940722",
            "Max": "Wood",
            "Tiles": "0.039565008",
            "Wood": "0.9210278"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.035507012",
            "Max": "Wood",
            "Tiles": "0.011386302",
            "Wood": "0.95310664"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.0076925126",
            "Max": "Wood",
            "Tiles": "0.004347389",
            "Wood": "0.9879601"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.016315999",
            "Max": "Wood",
            "Tiles": "0.016945967",
            "Wood": "0.966738"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.09937534",
            "Max": "Wood",
            "Tiles": "0.13103919",
            "Wood": "0.7695855"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorNotVisible"
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.066979095",
            "Max": "Wood",
            "Tiles": "0.10003825",
            "Wood": "0.8329826"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.19893031",
            "Max": "Wood",
            "Tiles": "0.072013885",
            "Wood": "0.7290558"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.2803377",
            "Max": "Wood",
            "Tiles": "0.2514314",
            "Wood": "0.46823087"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.13490082",
            "Max": "Wood",
            "Tiles": "0.05348548",
            "Wood": "0.81161374"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.40944815",
            "Max": "Wood",
            "Tiles": "0.13501954",
            "Wood": "0.45553228"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.121614784",
            "Max": "Wood",
            "Tiles": "0.06107986",
            "Wood": "0.8173053"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.97342426",
            "Max": "Carpet",
            "Tiles": "0.011869651",
            "Wood": "0.01470616"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.81035787",
            "Max": "Carpet",
            "Tiles": "0.07353919",
            "Wood": "0.11610298"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.57840794",
            "Max": "Carpet",
            "Tiles": "0.23399909",
            "Wood": "0.18759286"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.13364124",
            "Max": "Wood",
            "Tiles": "0.35982472",
            "Wood": "0.50653404"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.119816445",
            "Max": "Wood",
            "Tiles": "0.04416443",
            "Wood": "0.83601916"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.028169578",
            "Max": "Wood",
            "Tiles": "0.013540715",
            "Wood": "0.9582897"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorNotVisible"
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.20220496",
            "Max": "Wood",
            "Tiles": "0.14154361",
            "Wood": "0.6562514"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.16978478",
            "Max": "Wood",
            "Tiles": "0.022293026",
            "Wood": "0.80792224"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.012752038",
            "Max": "Wood",
            "Tiles": "0.003989393",
            "Wood": "0.9832586"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.05728006",
            "Max": "Wood",
            "Tiles": "0.38170215",
            "Wood": "0.5610178"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.0934887",
            "Max": "Wood",
            "Tiles": "0.13668355",
            "Wood": "0.7698277"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.016148627",
            "Max": "Wood",
            "Tiles": "0.0016159203",
            "Wood": "0.98223543"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.1286433",
            "Max": "Wood",
            "Tiles": "0.025948914",
            "Wood": "0.8454078"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.44556132",
            "Max": "Carpet",
            "Tiles": "0.14689814",
            "Wood": "0.40754053"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.09568761",
            "Max": "Wood",
            "Tiles": "0.020961536",
            "Wood": "0.88335085"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.154652",
            "Max": "Wood",
            "Tiles": "0.040191807",
            "Wood": "0.8051562"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.6433109",
            "Max": "Carpet",
            "Tiles": "0.027210262",
            "Wood": "0.3294788"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.836839",
            "Max": "Carpet",
            "Tiles": "0.004377484",
            "Wood": "0.15878345"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.8579177",
            "Max": "Carpet",
            "Tiles": "0.022935394",
            "Wood": "0.11914691"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.036709502",
            "Max": "Wood",
            "Tiles": "0.011587019",
            "Wood": "0.95170355"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.44666138",
            "Max": "Carpet",
            "Tiles": "0.16765636",
            "Wood": "0.3856823"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "Stairs"
    ],
    [
        "Indoor",
        "Stairs"
    ],
    [
        "Indoor",
        "Stairs"
    ],
    [
        "Indoor",
        "Stairs"
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.31132388",
            "Max": "Wood",
            "Tiles": "0.07581556",
            "Wood": "0.6128606"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.6453334",
            "Max": "Carpet",
            "Tiles": "0.1479894",
            "Wood": "0.20667721"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.6575177",
            "Max": "Carpet",
            "Tiles": "0.1370021",
            "Wood": "0.20548023"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.62276345",
            "Max": "Carpet",
            "Tiles": "0.18550213",
            "Wood": "0.19173443"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.8414227",
            "Max": "Carpet",
            "Tiles": "0.026950907",
            "Wood": "0.13162643"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.8260404",
            "Max": "Carpet",
            "Tiles": "0.0015985607",
            "Wood": "0.17236099"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.6059425",
            "Max": "Carpet",
            "Tiles": "0.15752871",
            "Wood": "0.2365288"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.6802725",
            "Max": "Carpet",
            "Tiles": "0.0822533",
            "Wood": "0.23747414"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.6504511",
            "Max": "Carpet",
            "Tiles": "0.12834565",
            "Wood": "0.22120315"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.788122",
            "Max": "Carpet",
            "Tiles": "0.020964053",
            "Wood": "0.190914"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.9576965",
            "Max": "Carpet",
            "Tiles": "0.002880641",
            "Wood": "0.039422885"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.97814685",
            "Max": "Carpet",
            "Tiles": "0.00097278605",
            "Wood": "0.02088026"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.93540365",
            "Max": "Carpet",
            "Tiles": "0.0015690096",
            "Wood": "0.0630273"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.92494833",
            "Max": "Carpet",
            "Tiles": "0.0024013533",
            "Wood": "0.072650224"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.7858952",
            "Max": "Carpet",
            "Tiles": "0.03799631",
            "Wood": "0.17610842"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.3492853",
            "Max": "Wood",
            "Tiles": "0.23683055",
            "Wood": "0.4138842"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.12247635",
            "Max": "Wood",
            "Tiles": "0.22043915",
            "Wood": "0.65708447"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.34639174",
            "Max": "Wood",
            "Tiles": "0.2556148",
            "Wood": "0.39799345"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.008281005",
            "Max": "Tiles",
            "Tiles": "0.9681873",
            "Wood": "0.023531636"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorNotVisible"
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.006590078",
            "Max": "Tiles",
            "Tiles": "0.9918419",
            "Wood": "0.0015680956"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorNotVisible"
    ],
    [
        "Indoor",
        "FloorNotVisible"
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.43967083",
            "Max": "Carpet",
            "Tiles": "0.15841931",
            "Wood": "0.40190983"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.88380045",
            "Max": "Carpet",
            "Tiles": "0.0265466",
            "Wood": "0.08965291"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.9656776",
            "Max": "Carpet",
            "Tiles": "0.0052110744",
            "Wood": "0.029111285"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.079612605",
            "Max": "Wood",
            "Tiles": "0.046010636",
            "Wood": "0.8743768"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.3592346",
            "Max": "Wood",
            "Tiles": "0.087831475",
            "Wood": "0.55293393"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.900999",
            "Max": "Carpet",
            "Tiles": "0.01344321",
            "Wood": "0.08555778"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.8235052",
            "Max": "Carpet",
            "Tiles": "0.013436073",
            "Wood": "0.16305865"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.8197872",
            "Max": "Carpet",
            "Tiles": "0.015086448",
            "Wood": "0.16512632"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.9272014",
            "Max": "Carpet",
            "Tiles": "0.006996501",
            "Wood": "0.06580212"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.96087414",
            "Max": "Carpet",
            "Tiles": "0.004633823",
            "Wood": "0.034492005"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.5448234",
            "Max": "Carpet",
            "Tiles": "0.05628711",
            "Wood": "0.39888942"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.43721008",
            "Max": "Wood",
            "Tiles": "0.093410134",
            "Wood": "0.46937984"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.11699585",
            "Max": "Wood",
            "Tiles": "0.037935417",
            "Wood": "0.84506875"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.68067414",
            "Max": "Carpet",
            "Tiles": "0.15757224",
            "Wood": "0.1617536"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.41094446",
            "Max": "Tiles",
            "Tiles": "0.50373274",
            "Wood": "0.08532284"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.77872944",
            "Max": "Carpet",
            "Tiles": "0.13675967",
            "Wood": "0.08451092"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.6892087",
            "Max": "Carpet",
            "Tiles": "0.109853685",
            "Wood": "0.20093761"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.41481498",
            "Max": "Tiles",
            "Tiles": "0.47310084",
            "Wood": "0.112084135"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.9823486",
            "Max": "Carpet",
            "Tiles": "0.0031089375",
            "Wood": "0.014542477"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorNotVisible"
    ],
    [
        "Indoor",
        "FloorNotVisible"
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.39435473",
            "Max": "Wood",
            "Tiles": "0.1808075",
            "Wood": "0.42483774"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.65236384",
            "Max": "Carpet",
            "Tiles": "0.064125255",
            "Wood": "0.28351092"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.616505",
            "Max": "Carpet",
            "Tiles": "0.11903786",
            "Wood": "0.26445714"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.59391797",
            "Max": "Carpet",
            "Tiles": "0.13085121",
            "Wood": "0.27523082"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.969277",
            "Max": "Carpet",
            "Tiles": "0.009974196",
            "Wood": "0.020748783"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.87337345",
            "Max": "Carpet",
            "Tiles": "0.08979327",
            "Wood": "0.03683317"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.907927",
            "Max": "Carpet",
            "Tiles": "0.032178853",
            "Wood": "0.059894215"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.9003104",
            "Max": "Carpet",
            "Tiles": "0.05395829",
            "Wood": "0.045731366"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.96300375",
            "Max": "Carpet",
            "Tiles": "0.010535071",
            "Wood": "0.026461175"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.7081236",
            "Max": "Carpet",
            "Tiles": "0.10844835",
            "Wood": "0.18342806"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.5794147",
            "Max": "Carpet",
            "Tiles": "0.13800353",
            "Wood": "0.28258178"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.18935017",
            "Max": "Wood",
            "Tiles": "0.04033089",
            "Wood": "0.770319"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.093517385",
            "Max": "Wood",
            "Tiles": "0.0878912",
            "Wood": "0.8185914"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.2695976",
            "Max": "Wood",
            "Tiles": "0.183241",
            "Wood": "0.54716146"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorNotVisible"
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.6896537",
            "Max": "Carpet",
            "Tiles": "0.0888975",
            "Wood": "0.22144888"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorNotVisible"
    ],
    [
        "Indoor",
        "FloorNotVisible"
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.42064172",
            "Max": "Wood",
            "Tiles": "0.030430859",
            "Wood": "0.54892737"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.9448113",
            "Max": "Carpet",
            "Tiles": "0.017088525",
            "Wood": "0.0381002"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.6838635",
            "Max": "Carpet",
            "Tiles": "0.05856064",
            "Wood": "0.25757584"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.19337063",
            "Max": "Wood",
            "Tiles": "0.025438363",
            "Wood": "0.781191"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.23648538",
            "Max": "Wood",
            "Tiles": "0.17118986",
            "Wood": "0.59232473"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.009465908",
            "Max": "Wood",
            "Tiles": "0.0017753519",
            "Wood": "0.9887587"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.19294715",
            "Max": "Wood",
            "Tiles": "0.094982274",
            "Wood": "0.7120706"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.46078098",
            "Max": "Carpet",
            "Tiles": "0.32594478",
            "Wood": "0.21327429"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorNotVisible"
    ],
    [
        "Indoor",
        "FloorNotVisible"
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.6558599",
            "Max": "Carpet",
            "Tiles": "0.09325958",
            "Wood": "0.25088048"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.8391275",
            "Max": "Carpet",
            "Tiles": "0.09702822",
            "Wood": "0.063844316"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.8393508",
            "Max": "Carpet",
            "Tiles": "0.05745853",
            "Wood": "0.10319062"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.9378165",
            "Max": "Carpet",
            "Tiles": "0.009181893",
            "Wood": "0.05300164"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.9484273",
            "Max": "Carpet",
            "Tiles": "0.0023503222",
            "Wood": "0.04922241"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.93019867",
            "Max": "Carpet",
            "Tiles": "0.0004658971",
            "Wood": "0.06933551"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.9304321",
            "Max": "Carpet",
            "Tiles": "7.5975426e-05",
            "Wood": "0.06949198"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.951793",
            "Max": "Carpet",
            "Tiles": "0.00035548353",
            "Wood": "0.047851443"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.99564266",
            "Max": "Carpet",
            "Tiles": "0.00016961891",
            "Wood": "0.004187754"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.92858845",
            "Max": "Carpet",
            "Tiles": "0.0027368355",
            "Wood": "0.06867466"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.9722276",
            "Max": "Carpet",
            "Tiles": "0.0005012778",
            "Wood": "0.02727111"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.92011917",
            "Max": "Carpet",
            "Tiles": "0.018628363",
            "Wood": "0.061252527"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.9969092",
            "Max": "Carpet",
            "Tiles": "0.0009091632",
            "Wood": "0.0021817337"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.9258323",
            "Max": "Carpet",
            "Tiles": "0.007236987",
            "Wood": "0.06693065"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.90784997",
            "Max": "Carpet",
            "Tiles": "0.013040781",
            "Wood": "0.07910925"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.51179796",
            "Max": "Carpet",
            "Tiles": "0.045195393",
            "Wood": "0.4430066"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.6726172",
            "Max": "Carpet",
            "Tiles": "0.07971551",
            "Wood": "0.24766734"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.9777281",
            "Max": "Carpet",
            "Tiles": "0.0042729643",
            "Wood": "0.01799885"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.91863877",
            "Max": "Carpet",
            "Tiles": "0.001118278",
            "Wood": "0.08024293"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.9636697",
            "Max": "Carpet",
            "Tiles": "0.0010812724",
            "Wood": "0.03524908"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.57314",
            "Max": "Carpet",
            "Tiles": "0.010107722",
            "Wood": "0.41675228"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.906005",
            "Max": "Carpet",
            "Tiles": "0.006078695",
            "Wood": "0.08791628"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.9994332",
            "Max": "Carpet",
            "Tiles": "6.3809017e-07",
            "Wood": "0.00056613"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.9833709",
            "Max": "Carpet",
            "Tiles": "0.00016363189",
            "Wood": "0.016465481"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.8665684",
            "Max": "Carpet",
            "Tiles": "0.0054136403",
            "Wood": "0.12801808"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.9605602",
            "Max": "Carpet",
            "Tiles": "0.0035925806",
            "Wood": "0.035847202"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.59557074",
            "Max": "Carpet",
            "Tiles": "0.0024233987",
            "Wood": "0.40200585"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.7579417",
            "Max": "Carpet",
            "Tiles": "0.008494318",
            "Wood": "0.23356396"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.68240434",
            "Max": "Carpet",
            "Tiles": "0.11940934",
            "Wood": "0.19818634"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.77148443",
            "Max": "Carpet",
            "Tiles": "0.13031887",
            "Wood": "0.09819679"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.70799756",
            "Max": "Carpet",
            "Tiles": "0.11879299",
            "Wood": "0.17320938"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "5.654274e-05",
            "Max": "Tiles",
            "Tiles": "0.99993515",
            "Wood": "8.314847e-06"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "7.92019e-05",
            "Max": "Tiles",
            "Tiles": "0.9999006",
            "Wood": "2.029411e-05"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorNotVisible"
    ],
    [
        "Indoor",
        "FloorNotVisible"
    ],
    [
        "Indoor",
        "FloorNotVisible"
    ],
    [
        "Indoor",
        "FloorNotVisible"
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.16475825",
            "Max": "Tiles",
            "Tiles": "0.7904862",
            "Wood": "0.044755578"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorNotVisible"
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.6287737",
            "Max": "Carpet",
            "Tiles": "0.0035065562",
            "Wood": "0.36771977"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.967254",
            "Max": "Carpet",
            "Tiles": "0.00803554",
            "Wood": "0.024710497"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorNotVisible"
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.8191997",
            "Max": "Carpet",
            "Tiles": "0.04188486",
            "Wood": "0.13891551"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.8910378",
            "Max": "Carpet",
            "Tiles": "0.076306805",
            "Wood": "0.03265527"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.7346335",
            "Max": "Carpet",
            "Tiles": "0.09482558",
            "Wood": "0.17054094"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "Stairs"
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.64526904",
            "Max": "Carpet",
            "Tiles": "0.013552912",
            "Wood": "0.34117806"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "Stairs"
    ],
    [
        "Indoor",
        "FloorNotVisible"
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.0072955",
            "Max": "Wood",
            "Tiles": "0.0009653999",
            "Wood": "0.99173903"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.06795923",
            "Max": "Wood",
            "Tiles": "0.009423943",
            "Wood": "0.9226169"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.34867606",
            "Max": "Wood",
            "Tiles": "0.26847312",
            "Wood": "0.3828508"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.5675381",
            "Max": "Carpet",
            "Tiles": "0.17346363",
            "Wood": "0.25899833"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.27319083",
            "Max": "Tiles",
            "Tiles": "0.38862452",
            "Wood": "0.33818465"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.15089239",
            "Max": "Wood",
            "Tiles": "0.03522261",
            "Wood": "0.813885"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.77574646",
            "Max": "Carpet",
            "Tiles": "0.0060197962",
            "Wood": "0.21823373"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorNotVisible"
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.049877703",
            "Max": "Wood",
            "Tiles": "0.16560721",
            "Wood": "0.7845151"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.10934978",
            "Max": "Wood",
            "Tiles": "0.043397024",
            "Wood": "0.8472532"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Outdoor",
        "FloorVisible",
        {
            "Asphalt": "0.99901927",
            "ConcreteBlock": "0.00041829527",
            "Grass": "0.00034094485",
            "Gravel": "0.0002059263",
            "Max": "Asphalt",
            "Sand": "1.1312711e-07",
            "Snow": "1.53985e-05",
            "Woodland": "5.3571256e-08"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Outdoor",
        "FloorVisible",
        {
            "Asphalt": "0.034840763",
            "ConcreteBlock": "0.96177155",
            "Grass": "0.0007602106",
            "Gravel": "0.0024940707",
            "Max": "ConcreteBlock",
            "Sand": "5.8944697e-06",
            "Snow": "0.0001270946",
            "Woodland": "4.7885766e-07"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Outdoor",
        "FloorVisible",
        {
            "Asphalt": "0.17394246",
            "ConcreteBlock": "0.81183213",
            "Grass": "0.0009651507",
            "Gravel": "0.013140754",
            "Max": "ConcreteBlock",
            "Sand": "4.532622e-05",
            "Snow": "6.0542796e-05",
            "Woodland": "1.36124345e-05"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Outdoor",
        "FloorVisible",
        {
            "Asphalt": "0.007606446",
            "ConcreteBlock": "0.9917436",
            "Grass": "5.3569318e-05",
            "Gravel": "0.00029169067",
            "Max": "ConcreteBlock",
            "Sand": "2.0139385e-07",
            "Snow": "0.00030448494",
            "Woodland": "1.4070071e-09"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Outdoor",
        "FloorVisible",
        {
            "Asphalt": "9.72209e-05",
            "ConcreteBlock": "0.9998938",
            "Grass": "3.4104224e-07",
            "Gravel": "3.9750935e-06",
            "Max": "ConcreteBlock",
            "Sand": "4.0353916e-09",
            "Snow": "4.6324562e-06",
            "Woodland": "6.8121264e-10"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Indoor",
        "FloorVisible",
        {
            "Carpet": "0.2461355",
            "Max": "Wood",
            "Tiles": "0.19440873",
            "Wood": "0.55945575"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Outdoor",
        "FloorNotVisible"
    ],
    [
        "Outdoor",
        "FloorVisible",
        {
            "Asphalt": "0.9133878",
            "ConcreteBlock": "0.06191849",
            "Grass": "0.009527745",
            "Gravel": "0.014802378",
            "Max": "Asphalt",
            "Sand": "0.00015165738",
            "Snow": "1.754313e-05",
            "Woodland": "0.00019448287"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Outdoor",
        "FloorVisible",
        {
            "Asphalt": "0.65414727",
            "ConcreteBlock": "0.056949265",
            "Grass": "0.23347154",
            "Gravel": "0.05158681",
            "Max": "Asphalt",
            "Sand": "0.0022264572",
            "Snow": "0.0001702108",
            "Woodland": "0.0014484489"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Outdoor",
        "FloorVisible",
        {
            "Asphalt": "0.07265286",
            "ConcreteBlock": "0.004567679",
            "Grass": "0.9164067",
            "Gravel": "0.0061205886",
            "Max": "Grass",
            "Sand": "6.0709917e-05",
            "Snow": "7.0023207e-06",
            "Woodland": "0.00018442792"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Outdoor",
        "FloorVisible",
        {
            "Asphalt": "0.11113569",
            "ConcreteBlock": "0.0005965284",
            "Grass": "0.8658336",
            "Gravel": "0.011625341",
            "Max": "Grass",
            "Sand": "0.00928545",
            "Snow": "6.9286925e-06",
            "Woodland": "0.0015164762"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Outdoor",
        "FloorVisible",
        {
            "Asphalt": "0.01841791",
            "ConcreteBlock": "0.00020653677",
            "Grass": "0.9655568",
            "Gravel": "0.004957377",
            "Max": "Grass",
            "Sand": "0.009194863",
            "Snow": "8.912034e-06",
            "Woodland": "0.0016576258"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Outdoor",
        "FloorVisible",
        {
            "Asphalt": "0.0533173",
            "ConcreteBlock": "0.00089208275",
            "Grass": "0.9322066",
            "Gravel": "0.013332596",
            "Max": "Grass",
            "Sand": "7.014406e-05",
            "Snow": "5.300758e-07",
            "Woodland": "0.0001808217"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Outdoor",
        "FloorVisible",
        {
            "Asphalt": "0.012641845",
            "ConcreteBlock": "0.0011018125",
            "Grass": "0.98269904",
            "Gravel": "0.0033777556",
            "Max": "Grass",
            "Sand": "7.791289e-05",
            "Snow": "1.643429e-06",
            "Woodland": "9.9894074e-05"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Outdoor",
        "FloorVisible",
        {
            "Asphalt": "0.1486223",
            "ConcreteBlock": "0.0046662036",
            "Grass": "0.83145493",
            "Gravel": "0.015102181",
            "Max": "Grass",
            "Sand": "2.979132e-05",
            "Snow": "1.1974672e-06",
            "Woodland": "0.00012337507"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Outdoor",
        "FloorVisible",
        {
            "Asphalt": "0.07751577",
            "ConcreteBlock": "0.8653813",
            "Grass": "0.008245725",
            "Gravel": "0.047573324",
            "Max": "ConcreteBlock",
            "Sand": "0.0007165448",
            "Snow": "0.00043550116",
            "Woodland": "0.00013191107"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Outdoor",
        "FloorNotVisible"
    ],
    [
        "Outdoor",
        "FloorNotVisible"
    ],
    [
        "Outdoor",
        "FloorNotVisible"
    ],
    [
        "Outdoor",
        "FloorVisible",
        {
            "Asphalt": "0.0012172094",
            "ConcreteBlock": "0.9956209",
            "Grass": "3.2409935e-05",
            "Gravel": "6.792154e-05",
            "Max": "ConcreteBlock",
            "Sand": "0.00021670564",
            "Snow": "0.0028413523",
            "Woodland": "3.507089e-06"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Outdoor",
        "FloorNotVisible"
    ],
    [
        "Outdoor",
        "FloorVisible",
        {
            "Asphalt": "0.9788326",
            "ConcreteBlock": "0.0066208793",
            "Grass": "0.0028435977",
            "Gravel": "0.0005015956",
            "Max": "Asphalt",
            "Sand": "7.5724485e-05",
            "Snow": "3.5273373e-05",
            "Woodland": "0.011090419"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Outdoor",
        "FloorVisible",
        {
            "Asphalt": "0.9515014",
            "ConcreteBlock": "0.0019347357",
            "Grass": "0.016579222",
            "Gravel": "0.017445723",
            "Max": "Asphalt",
            "Sand": "1.4124123e-05",
            "Snow": "1.3859625e-06",
            "Woodland": "0.012523416"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Outdoor",
        "FloorNotVisible"
    ],
    [
        "Outdoor",
        "FloorVisible",
        {
            "Asphalt": "0.24321997",
            "ConcreteBlock": "0.00036289683",
            "Grass": "0.36646548",
            "Gravel": "5.9954746e-05",
            "Max": "Woodland",
            "Sand": "2.9196743e-05",
            "Snow": "4.4177577e-06",
            "Woodland": "0.3898582"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Outdoor",
        "FloorVisible",
        {
            "Asphalt": "0.98223233",
            "ConcreteBlock": "0.00024952771",
            "Grass": "0.002749695",
            "Gravel": "0.012499668",
            "Max": "Asphalt",
            "Sand": "0.00014299725",
            "Snow": "5.7561756e-06",
            "Woodland": "0.002120039"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Outdoor",
        "FloorVisible",
        {
            "Asphalt": "0.9617508",
            "ConcreteBlock": "0.0010307492",
            "Grass": "0.015957942",
            "Gravel": "0.004746181",
            "Max": "Asphalt",
            "Sand": "0.00011586532",
            "Snow": "4.6753207e-06",
            "Woodland": "0.01639377"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Outdoor",
        "FloorVisible",
        {
            "Asphalt": "0.84823257",
            "ConcreteBlock": "9.23141e-05",
            "Grass": "0.019156002",
            "Gravel": "0.1316763",
            "Max": "Asphalt",
            "Sand": "2.3320721e-05",
            "Snow": "1.7663026e-06",
            "Woodland": "0.0008177273"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Outdoor",
        "FloorVisible",
        {
            "Asphalt": "0.82325923",
            "ConcreteBlock": "0.00017425687",
            "Grass": "0.15812357",
            "Gravel": "0.017519342",
            "Max": "Asphalt",
            "Sand": "6.486328e-05",
            "Snow": "7.8826173e-07",
            "Woodland": "0.000857944"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Outdoor",
        "FloorVisible",
        {
            "Asphalt": "0.06549652",
            "ConcreteBlock": "0.00012678484",
            "Grass": "0.14044552",
            "Gravel": "0.29450393",
            "Max": "Woodland",
            "Sand": "0.00016026676",
            "Snow": "5.5727633e-06",
            "Woodland": "0.49926147"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Outdoor",
        "FloorVisible",
        {
            "Asphalt": "0.073738225",
            "ConcreteBlock": "2.2752296e-05",
            "Grass": "0.0020161571",
            "Gravel": "0.9158367",
            "Max": "Gravel",
            "Sand": "7.681885e-06",
            "Snow": "1.8173729e-06",
            "Woodland": "0.00837662"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Outdoor",
        "FloorVisible",
        {
            "Asphalt": "0.0056472095",
            "ConcreteBlock": "3.5625213e-05",
            "Grass": "0.7211372",
            "Gravel": "0.24158871",
            "Max": "Grass",
            "Sand": "7.843562e-05",
            "Snow": "3.11626e-05",
            "Woodland": "0.031481624"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Outdoor",
        "FloorVisible",
        {
            "Asphalt": "0.8472146",
            "ConcreteBlock": "0.00029098778",
            "Grass": "0.08521364",
            "Gravel": "0.047279034",
            "Max": "Asphalt",
            "Sand": "0.0016212336",
            "Snow": "1.5850157e-05",
            "Woodland": "0.018364627"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Outdoor",
        "FloorVisible",
        {
            "Asphalt": "0.430017",
            "ConcreteBlock": "4.4929722e-05",
            "Grass": "0.5687477",
            "Gravel": "0.0011650545",
            "Max": "Grass",
            "Sand": "3.5959204e-07",
            "Snow": "1.1213972e-08",
            "Woodland": "2.492214e-05"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Outdoor",
        "FloorVisible",
        {
            "Asphalt": "0.28621837",
            "ConcreteBlock": "0.0019244867",
            "Grass": "0.23518321",
            "Gravel": "0.47475955",
            "Max": "Gravel",
            "Sand": "9.547077e-05",
            "Snow": "6.6719135e-06",
            "Woodland": "0.0018123019"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Outdoor",
        "FloorVisible",
        {
            "Asphalt": "0.9388856",
            "ConcreteBlock": "0.00011770155",
            "Grass": "0.058013342",
            "Gravel": "0.002110939",
            "Max": "Asphalt",
            "Sand": "5.6222543e-05",
            "Snow": "7.084173e-07",
            "Woodland": "0.00081538147"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Outdoor",
        "FloorVisible",
        {
            "Asphalt": "0.97857386",
            "ConcreteBlock": "2.7965172e-05",
            "Grass": "0.01989632",
            "Gravel": "0.0012986665",
            "Max": "Asphalt",
            "Sand": "6.1372484e-06",
            "Snow": "2.3417441e-07",
            "Woodland": "0.00019683343"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Outdoor",
        "FloorVisible",
        {
            "Asphalt": "0.40396696",
            "ConcreteBlock": "0.00013398395",
            "Grass": "0.59165996",
            "Gravel": "0.0025641813",
            "Max": "Grass",
            "Sand": "0.00094803906",
            "Snow": "0.0002332794",
            "Woodland": "0.0004936368"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Outdoor",
        "FloorVisible",
        {
            "Asphalt": "0.35686532",
            "ConcreteBlock": "0.00013681053",
            "Grass": "0.6167564",
            "Gravel": "0.025083318",
            "Max": "Grass",
            "Sand": "5.260324e-05",
            "Snow": "2.1850137e-05",
            "Woodland": "0.0010837874"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Outdoor",
        "FloorVisible",
        {
            "Asphalt": "0.7487313",
            "ConcreteBlock": "0.11082988",
            "Grass": "0.01699645",
            "Gravel": "0.113152206",
            "Max": "Asphalt",
            "Sand": "0.009333061",
            "Snow": "0.00032324015",
            "Woodland": "0.0006338327"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Outdoor",
        "FloorNotVisible"
    ],
    [
        "Outdoor",
        "FloorNotVisible"
    ],
    [
        "Outdoor",
        "FloorNotVisible"
    ],
    [
        "Outdoor",
        "FloorNotVisible"
    ],
    [
        "Outdoor",
        "FloorNotVisible"
    ],
    [
        "Outdoor",
        "FloorNotVisible"
    ],
    [
        "Outdoor",
        "FloorVisible",
        {
            "Asphalt": "0.02584878",
            "ConcreteBlock": "0.00043221065",
            "Grass": "0.971152",
            "Gravel": "0.0024396495",
            "Max": "Grass",
            "Sand": "7.429329e-06",
            "Snow": "4.1048943e-07",
            "Woodland": "0.00011954808"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Outdoor",
        "FloorVisible",
        {
            "Asphalt": "0.0048216367",
            "ConcreteBlock": "0.00019531297",
            "Grass": "0.9943897",
            "Gravel": "0.0005793672",
            "Max": "Grass",
            "Sand": "3.9595957e-06",
            "Snow": "2.8329316e-07",
            "Woodland": "9.61432e-06"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Outdoor",
        "FloorVisible",
        {
            "Asphalt": "0.015262254",
            "ConcreteBlock": "0.0008662374",
            "Grass": "0.983158",
            "Gravel": "0.000694986",
            "Max": "Grass",
            "Sand": "1.1322086e-05",
            "Snow": "1.8558009e-07",
            "Woodland": "6.9681532e-06"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Outdoor",
        "FloorVisible",
        {
            "Asphalt": "0.050434828",
            "ConcreteBlock": "0.0030475368",
            "Grass": "0.9453303",
            "Gravel": "0.0011854547",
            "Max": "Grass",
            "Sand": "9.810857e-07",
            "Snow": "2.4811598e-07",
            "Woodland": "6.415472e-07"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Outdoor",
        "FloorNotVisible"
    ],
    [
        "Outdoor",
        "FloorNotVisible"
    ],
    [
        "Outdoor",
        "FloorVisible",
        {
            "Asphalt": "0.46869174",
            "ConcreteBlock": "0.4074149",
            "Grass": "0.094135135",
            "Gravel": "0.027811661",
            "Max": "Asphalt",
            "Sand": "0.0007964974",
            "Snow": "0.0010333387",
            "Woodland": "0.00011672162"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Outdoor",
        "FloorVisible",
        {
            "Asphalt": "0.20022744",
            "ConcreteBlock": "0.7822971",
            "Grass": "0.0037319714",
            "Gravel": "0.011582673",
            "Max": "ConcreteBlock",
            "Sand": "0.0020640276",
            "Snow": "8.5049476e-05",
            "Woodland": "1.182664e-05"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Outdoor",
        "FloorVisible",
        {
            "Asphalt": "0.024592672",
            "ConcreteBlock": "0.9739042",
            "Grass": "7.492662e-05",
            "Gravel": "0.0013837151",
            "Max": "ConcreteBlock",
            "Sand": "4.0547016e-05",
            "Snow": "3.1677237e-06",
            "Woodland": "7.16054e-07"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Outdoor",
        "FloorVisible",
        {
            "Asphalt": "0.7817516",
            "ConcreteBlock": "0.20969705",
            "Grass": "0.0021952444",
            "Gravel": "0.006083948",
            "Max": "Asphalt",
            "Sand": "0.00021362022",
            "Snow": "4.79777e-05",
            "Woodland": "1.0609865e-05"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Outdoor",
        "FloorVisible",
        {
            "Asphalt": "0.87083507",
            "ConcreteBlock": "0.122093484",
            "Grass": "0.0006427087",
            "Gravel": "0.0056531103",
            "Max": "Asphalt",
            "Sand": "0.00066223956",
            "Snow": "6.720672e-05",
            "Woodland": "4.6109824e-05"
        },
        {
            "max": "Max"
        }
    ],
    [
        "Outdoor",
        "FloorVisible",
        {
            "Asphalt": "0.92118764",
            "ConcreteBlock": "0.07026446",
            "Grass": "0.0011543893",
            "Gravel": "0.0068509746",
            "Max": "Asphalt",
            "Sand": "0.00047277854",
            "Snow": "2.91845e-05",
            "Woodland": "4.06389e-05"
        },
        {
            "max": "Max"
        }
    ]
]
*/