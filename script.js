//*****************************************************
// var declaration
//*****************************************************

var inRes = document.getElementById("resistance"),
    inENot = document.getElementById("enot"),
    inTol = document.getElementById("tolerance"),
    outFull = document.getElementById("full"),
    outMM = document.getElementById("minmax"),
    inB1T= document.getElementById("band1t"),
    inB1S = document.getElementById("band1s"),
    inB2T = document.getElementById("band2t"),
    inB2S = document.getElementById("band2s"),
    inB3T = document.getElementById("band3t"),
    inB3S = document.getElementById("band3s"),
    inB4T = document.getElementById("band4t"),
    inB4S = document.getElementById("band4s");

var c = document.getElementById("canvas");

var canv = c.getContext('2d');

var black = "#000",
    brown = "#840",
    red = "#F00",
    orange = "#F9A509",
    yellow = "#FF0",
    green = "#080",
    blue = "#22F",
    violet = "#B30AC9",
    grey = "#888",
    white = "#FDFDFD",
    gold = "#D8AC31",
    silver = "#BBB",
    error_color = "#0FF";

const RES_COLOR = "#EED48F"

//*****************************************************
// draw resistor canvas
//*****************************************************

canv.fillStyle = RES_COLOR;
canv.beginPath();
canv.rect(100,25,440,200);
canv.fill();

//*****************************************************
// definitions
//*****************************************************

var cBands = {
    col1: yellow,
    col2: violet,
    col3: red,
    col4: gold,
    digitToBand: function(digit) {
        switch (parseInt(digit)){
            case 0:
                return black;
            case 1:
                return brown;
            case 2:
                return red;
            case 3:
                return orange;
            case 4:
                return yellow;
            case 5:
                return green;
            case 6:
                return blue;
            case 7:
                return violet;
            case 8:
                return grey;
            case 9:
                return white;
            default:
                console.warn("script.js: cBands.digitToBand() failed to parse arg0");
                return error_color;
        }
    },
    multiplierToBand: function(mult) {
        switch (parseFloat(mult)) {
            case 1:
                return black;
            case 10:
                return brown;
            case 100:
                return red;
            case 1000:
                return orange;
            case 10000:
                return yellow;
            case 100000:
                return green;
            case 1000000:
                return blue;
            case 10000000:
                return violet;
            case 100000000:
                return grey;
            case 1000000000:
                return white;
            case .1:
                return gold;
            case .01:
                return silver;
            default:
                console.warn("script.js: cBands.multplierToBand() failed to parse arg0: " + mult);
                return error_color;
        }
    },
    toleranceToBand: function(tol) {
        switch (parseFloat(tol)) {
            case .01:
                return brown;
            case .02:
                return red;
            case .005:
                return green;
            case .0025:
                return blue;
            case .001:
                return violet;
            case .0005:
                return grey;
            case .05:
                return gold;
            case .1:
                return silver;
            case .2:
                return RES_COLOR;
            default:
                console.warn("script.js: cBands.toleranceToBand() no color band exists for tolerance value: " + tol);
                return error_color;
        }
        return 0;
    },
    updateBands: function(  d1 = this.digitToBand(inB1T.value),
                            d2 = this.digitToBand(inB2T.value),
                            m = this.multiplierToBand(inB3T.value),
                            t = this.toleranceToBand(parseFloat(inB4T.value)*.01)
                        ){
        this.colBand1(d1);
        this.colBand2(d2);
        this.colBand3(m);
        this.colBand4(t);
    },
    colBand1: function(col){
        canv.beginPath();
        canv.fillStyle=col;
        canv.rect(130,25,70,200);
        canv.fill();
    },
    colBand2: function(col){
        canv.beginPath();
        canv.fillStyle=col;
        canv.rect(230,25,70,200);
        canv.fill();
    },
    colBand3: function(col){
        canv.beginPath();
        canv.fillStyle=col;
        canv.rect(330,25,70,200);
        canv.fill();
    },
    colBand4: function(col){
        canv.beginPath();
        canv.fillStyle=col;
        canv.rect(430,25,70,200);
        canv.fill();
    }
}

var resistance = {
    val: 4700,
    fromENot: function(eNot){        
        var baseVal = 0.0;
        try{
            baseVal = parseFloat(eNot);
        } catch(e) {
            console.warn("script.js: Could not parse Notation field.");
            console.warn("script.js: " + e);
            return NaN;
        }
        
        for (var i = 0; i < eNot.length; i++) {
            if (isNaN(eNot[i])){
                
                switch (eNot[i]) {
                    case 'G':
                        baseVal *= 1000;
                    case 'M':
                        baseVal *= 1000;
                    case 'k':
                        baseVal *= 1000;
                    case ' ':
                    case '.':
                        break;
                    default:
                        console.warn("script.js: resistance: could not parse notation field, baseVal: " + baseVal);
                        console.warn("script.js: resistance: last element evaluate: " + i + " on " + eNot + ": " + eNot[i]);
                        return NaN;
                }
            }
        }

        this.val = baseVal;

        return this.val;
    },
    fromMM: function(min, max){
        this.val = (min + max)/2
        return this.val;
    },
    fromBands: function(band1, band2, band3){
        this.val = ((band1 *10) + band2)*(band3);
        return this.val;
    }
}

var eNotation = {
    val: "4.7k",
    fromRes: function(res){
        var baseVal = res.toString(),
        multiplier = 0;

        if (res <= 0) {
            baseVal = res;
        } else if (res > 0 && res < 1000) {
            this.val = baseVal;
        } else if (res >= 1000 && res < 1000000) {
            baseVal = (res/1000).toString() + "k";
            this.val = baseVal;
        } else if (res >= 1000000 && res < 1000000000) {
            baseVal = (res/1000000).toString() + "M";
            this.val = baseVal;
        } else if (res >= 1000000000 && res < 1000000000000) {
            baseVal = (res/1000000000).toString() + "G";
            this.val = baseVal;
        } else {
            console.warn("script.js: resistance value out of range");
            return NaN;
        }

        return this.val;
    },
    fromMM: function(min,max){
        this.fromRes((min+max)/2);
        return this.val;
    },
    fromBands: function(band1, band2, band3){
        this.val = this.fromRes( (band1 *10) + band2)*(band3 );
        
        return this.val;
    }
}

var tolerance = {
    val: .05,
    fromMM: function(min,max){
        this.val = (Math.round(100*(1 - (min / ((min + max)/2)))))/100;
        return this.val;
    },
    fromBands: function(b4) {
        this.val = b4;
        return this.val;
    }
}

var minimum = {
    val: 4465,
    fromResTol: function (res, tolerance) {
        this.val = (Math.floor(res*(1-tolerance)*100))/100;
        return this.val;
    },
    fromBands: function(band1,band2,band3,band4){
        this.val = this.fromResTol(((band1 *10) + band2) * (band3),band4);
        return this.val;
    }
}

var maximum = {
    val: 4935,
    fromResTol: function(res, tolerance) {
        this.val = Math.floor(res*(1+tolerance)*100)/100;
        return this.val;
    },
    fromBands: function(band1,band2,band3,band4){
        this.val = this.fromResTol(((band1 *10) + band2)*(band3),band4);
        return this.val;
    }
}

var band1 = {
    val: 4,
    fromRes: function(res) {
        if (res >= 1) {
            while (Math.floor(res/10) > 0) {
                res = Math.floor(res/10);
            }
            this.val = res;
        } else if (res > 0) {
            while (res < 1){
                res = res*10;
            }
            this.val = Math.floor(res);
        } else if (res==0) {
            this.val = 0;
        } else {
            console.warn("script.js: band1: cannot parse band1 from negative or nonscalar values");
            return NaN;
        }
        return this.val;
    },
    fromENot: function(eNot) {
        if (isNaN(parseFloat(eNot))) {
            console.warn("script.js: band1: could not parse float from E Notation");
            return NaN;
        }

        this.val = this.fromRes(parseFloat(eNot));

        return this.val;
    },
    fromMM: function(min,max) {
        this.val = this.fromRes((min+max)/2);
        return this.val;
    },
    updateSelect: function(value=this.val){
        switch (parseInt(value)){
            case 1:
                inB1S.value = "brown";
                break;
            case 2:
                inB1S.value = "red";
                break;
            case 3:
                inB1S.value = "orange";
                break;
            case 4:
                inB1S.value = "yellow";
                break;
            case 5:
                inB1S.value = "green";
                break;
            case 6:
                inB1S.value = "blue";
                break;
            case 7:
                inB1S.value = "violet";
                break;
            case 8:
                inB1S.value = "grey";
                break;
            case 9:
                inB1S.value = "white";
                break;
            default:
                console.error("script.js: inB1T: you broke this");
        }
    }
}

var band2 = {
    val: 7,
    fromRes: function(res) {

        if (isNaN(parseFloat(res))) {
            console.warn("script.js: band2: could not parse float from resistance");
            return NaN;
        }

        if (res < 0) {
            console.warn("script.js: band2: could not parse negative value from resistance");
            return NaN;
        }

        while (res % 1  > 0) {
            res = res * 10;
        }

        if (res >= 1) {

            while (res >= 100) {
                res = res/10;
            }
            this.val = res % 10;
        }

        return this.val;
    },
    fromENot: function(eNot) {
        if (isNaN(parseFloat(eNot))) {
            console.warn("script.js: band2: could not parse float from E Notation");
            return NaN;
        }

        this.val = this.fromRes(parseFloat(eNot));

        return this.val;
    },

    fromMM: function(min,max) {
        this.val = this.fromRes((min+max)/2);
        return this.val;
    },
    updateSelect: function(value=this.val) {
        switch (parseInt(value)){
            case 0:
                inB2S.value = "black";
                break;
            case 1:
                inB2S.value = "brown";
                break;
            case 2:
                inB2S.value = "red";
                break;
            case 3:
                inB2S.value = "orange";
                break;
            case 4:
                inB2S.value = "yellow";
                break;
            case 5:
                inB2S.value = "green";
                break;
            case 6:
                inB2S.value = "blue";
                break;
            case 7:
                inB2S.value = "violet";
                break;
            case 8:
                inB2S.value = "grey";
                break;
            case 9:
                inB2S.value = "white";
                break;
            default:
                console.error("script.js: inB2T: you broke this");
        }
    }
}

var band3 = {
    val: 100,
    fromRes: function(res) {
        if (isNaN(parseFloat(res))) {
            console.warn("script.js: band3: could not parse float from resistance");
            return NaN;
        }

        if (parseFloat(res) < 0) {
            console.warn("script.js: band3: could not parse negative value from resistance");
            return NaN;
        }

        baseVal = parseFloat(res);

        var multiplier = 1;

        while (baseVal > 10){
            baseVal /= 10;
            multiplier *= 10;
        }

        while (baseVal < 10) {
            baseVal *= 10;
            multiplier /= 10;
        }
        
        this.val = multiplier;
        return this.val;
    },
    fromENot: function(eNot) {        
        if (isNaN(parseFloat(eNot))) {
            console.warn("script.js: band3: could not parse float from resistance");
            return NaN;
        }

        if (parseFloat(eNot) < 0) {
            console.warn("script.js: band3: could not parse negative value from resistance");
            return NaN;
        }

        var number = parseFloat(eNot);

        for (var i = 0; i < eNot.length; i++) {
            if (isNaN(eNot[i])){
                
                switch ((eNot[i]).toLowerCase()) {
                    case 'g':
                        number *= 1000;
                    case 'm':
                        number *= 1000;
                    case 'k':
                        number *= 1000;
                    case ' ':
                    case '.':
                        break;
                    default:
                        console.warn("script.js: resistance: could not parse notation field, baseVal: " + baseVal);
                        console.warn("script.js: resistance: last element evaluate: " + i + " on " + eNot + ": " + eNot[i]);
                        return NaN;
                }
            }
        }

        this.val = this.fromRes(number);
        return this.val;
    },
    fromMM: function(min,max) {
        this.val = this.fromRes((min+max)/2);
        return this.val;
    },
    updateSelect: function(value = this.val ) {
        switch (parseFloat(value)){
            case 1:
                inB3S.value = "black";
                break;
            case 10:
                inB3S.value = "brown";
                break;
            case 100:
                inB3S.value = "red";
                break;
            case 1000:
                inB3S.value = "orange";
                break;
            case 10000:
                inB3S.value = "yellow";
                break;
            case 100000:
                inB3S.value = "green";
                break;
            case 1000000:
                inB3S.value = "blue";
                break;
            case 10000000:
                inB3S.value = "violet";
                break;
            case 100000000:
                inB3S.value = "grey";
                break;
            case 1000000000:
                inB3S.value = "white";
                break;
            case .1:
                inB3S.value="gold";
                break;
            case .01:
                inB3S.value="silver";
                break;
            default:
                console.error("script.js: inB3T: you broke this");
        }
    }
}

var band4 = {
    val: .05,
    fromTol: function(tol){
        this.val = tol;
        return this.val;
    },
    fromMM: function(min, max) {
        this.val = (Math.round(100*(1 - (min / ((min + max)/2)))))/100;
        return this.val;
    },
    updateSelect: function(value = this.val){
        switch (parseFloat(value)) {
            case 1:
                inB4S.value = "brown";
                break;
            case 2:
                inB4S.value = "red";
                break;
            case .5:
                inB4S.value = "green";
                break;
            case .25:
                inB4S.value = "blue";
                break;
            case .1:
                inB4S.value = "violet";
                break;
            case .05:
                inB4S.value = "grey";
                break;
            case 5:
                inB4S.value = "gold";
                break;
            case 10:
                inB4S.value = "silver";
                break;
            default:
                console.warn("script.js: inB4T: tolerance value out of range for selection");
        }
    }
}

rMath = {
    toENot: function(num) {               
        if (isNaN(parseFloat(num))) {
            console.warn("script.js: rMath: could not parse float from arg0");
            return NaN;
        }

        if (parseFloat(num) < 0) {
            console.warn("script.js: rMath: could not parse negative value from arg0: " + num);
            return NaN;
        }


        return ((this.getSigSet(num)).toString() + this.getEMChar(num));
        
    },

    // getSigFig: function(num, sig) {
    //     var count = this.getDigitCount(num);
    //     return Math.floor(num/Math.pow(10,count-sig))%10;
    // },

    getSigSet: function(num) {
        return num / Math.pow(10, Math.floor((this.getDigitCount(num)-1)/3)*3);
    },
    getDigitCount: function(num){
        var i = 0;

        while (Math.floor(num/Math.pow(10,i)) > 0) i++;

        return i;
    },
    getEMChar: function(num){
        switch ( (num >= 1) ? Math.floor((this.getDigitCount(num)-1)/3) : 0 ) {
            case 0: return '';
            case 1: return 'k';
            case 2: return 'M';
            case 3: return 'G';
            default: {
                console.warn("script.js: rMath.getEMChar: switch result from arg0 out of range, arg0: " + num + " > " + Math.floor((this.getDigitCount(num)-1)/3)*3);
                return undefined;
            }
        }
    }
}

//*****************************************************
// draw default color bands
//*****************************************************
cBands.updateBands();

//*****************************************************
// ui functions
//*****************************************************

inRes.addEventListener("input", function(){
    resistance.val = this.value;
    inENot.value = eNotation.fromRes(this.value);
    minimum.fromResTol(this.value,tolerance.val);
    maximum.fromResTol(this.value,tolerance.val);
    inB1T.value = band1.fromRes(this.value);
    inB2T.value = band2.fromRes(this.value);
    inB3T.value = band3.fromRes(this.value);
    band1.updateSelect();
    band2.updateSelect();
    band3.updateSelect();

    outFull.innerHTML = eNotation.val +  " Ω ± " + (tolerance.val*100) + "%";
    
    var enMin = rMath.toENot(minimum.val);
    var enMax = rMath.toENot(maximum.val);

    outMM.innerHTML = enMin + " to " + enMax + " Ohms";
    cBands.updateBands();
});

inENot.addEventListener("input", function(){
    eNotation.val = this.value;
    inRes.value = resistance.fromENot(this.value);
    minimum.fromResTol(resistance.val,tolerance.val);
    maximum.fromResTol(resistance.val,tolerance.val);
    inB1T.value = band1.fromENot(this.value);
    inB2T.value = band2.fromENot(this.value);
    inB3T.value = band3.fromENot(this.value);
    band1.updateSelect();
    band2.updateSelect();
    band3.updateSelect();

    outFull.innerHTML = resistance.val +  " Ω ± " + (tolerance.val*100) + "%";
    
    var enMin = rMath.toENot(minimum.val);
    var enMax = rMath.toENot(maximum.val);

    outMM.innerHTML = enMin + " to " + enMax + " Ohms";
    cBands.updateBands();

});

inTol.addEventListener("input", function(){
    tolerance.val = parseFloat(this.value)*.01;
    inB4T.value = band4.fromTol(this.value);
    band4.updateSelect();

    minimum.fromResTol(resistance.val,tolerance.val);
    maximum.fromResTol(resistance.val,tolerance.val);    

    outFull.innerHTML = eNotation.val +  " Ω ± " + (tolerance.val*100) + "%";
    
    var enMin = rMath.toENot(minimum.val);
    var enMax = rMath.toENot(maximum.val);

    outMM.innerHTML = enMin + " to " + enMax + " Ohms";
    cBands.updateBands();
});

inB1T.addEventListener("input", function(){
    if (parseInt(this.value) > 0 && parseInt(this.value) < 10){
        band1.val = parseInt(this.value);
        band1.updateSelect(this.value);

        inRes.value = resistance.fromBands(band1.val,band2.val,band3.val);
        inENot.value = eNotation.fromRes(resistance.val);

        minimum.fromResTol(resistance.val,tolerance.val);
        maximum.fromResTol(resistance.val,tolerance.val);    

        outFull.innerHTML = eNotation.val +  " Ω ± " + (tolerance.val*100) + "%";
        
        var enMin = rMath.toENot(minimum.val);
        var enMax = rMath.toENot(maximum.val);

        outMM.innerHTML = enMin + " to " + enMax + " Ohms";
        cBands.updateBands();
    } else {
        console.warn("script.js: inB1T: first digit band value out of range");
    }
});


inB1S.addEventListener("input", function(){    
        switch (this.value){
            case "brown":
                inB1T.value = band1.val = 1;
                break;
            case "red":
                inB1T.value = band1.val = 2;
                break;
            case "orange":
                inB1T.value = band1.val = 3;
                break;
            case "yellow":
                inB1T.value = band1.val = 4;
                break;
            case "green":
                inB1T.value = band1.val = 5;
                break;
            case "blue":
                inB1T.value = band1.val = 6;
                break;
            case "violet":
                inB1T.value = band1.val = 7;
                break;
            case "grey":
                inB1T.value = band1.val = 8;
                break;
            case "white":
                inB1T.value = band1.val = 9;
                break;
            default:
                console.error("script.js: inB1S: you broke this");
        }


        inRes.value = resistance.fromBands(band1.val,band2.val,band3.val);
        inENot.value = eNotation.fromRes(resistance.val);

        minimum.fromResTol(resistance.val,tolerance.val);
        maximum.fromResTol(resistance.val,tolerance.val);    

        outFull.innerHTML = eNotation.val +  " Ω ± " + (tolerance.val*100) + "%";
        
        var enMin = rMath.toENot(minimum.val);
        var enMax = rMath.toENot(maximum.val);

        outMM.innerHTML = enMin + " to " + enMax + " Ohms";
        cBands.updateBands();
})

inB2T.addEventListener("input", function(){
    if (parseInt(this.value) >= 0 && parseInt(this.value) < 10){
        band2.val = parseInt(this.value);
        band2.updateSelect(this.value);
        inRes.value = resistance.fromBands(band1.val,band2.val,band3.val);
        inENot.value = eNotation.fromRes(resistance.val);

        minimum.fromResTol(resistance.val,tolerance.val);
        maximum.fromResTol(resistance.val,tolerance.val);    

        outFull.innerHTML = eNotation.val +  " Ω ± " + (tolerance.val*100) + "%";
        
        var enMin = rMath.toENot(minimum.val);
        var enMax = rMath.toENot(maximum.val);

        outMM.innerHTML = enMin + " to " + enMax + " Ohms";
        cBands.updateBands();
    } else {
        console.warn("script.js: inB2T: second digit band value out of range");
    }
});

inB2S.addEventListener("input", function(){
    switch (this.value){
        case "black":
            inB2T.value = band2.val = 0;
            break;
        case "brown":
            inB2T.value = band2.val = 1;
            break;
        case "red":
            inB2T.value = band2.val = 2;
            break;
        case "orange":
            inB2T.value = band2.val = 3;
            break;
        case "yellow":
            inB2T.value = band2.val = 4;
            break;
        case "green":
            inB2T.value = band2.val = 5;
            break;
        case "blue":
            inB2T.value = band2.val = 6;
            break;
        case "violet":
            inB2T.value = band2.val = 7;
            break;
        case "grey":
            inB2T.value = band2.val = 8;
            break;
        case "white":
            inB2T.value = band2.val = 9;
            break;
        default:
            console.error("script.js: inB2S: you broke this");
    }
    inRes.value = resistance.fromBands(band1.val,band2.val,band3.val);
    inENot.value = eNotation.fromRes(resistance.val);

    minimum.fromResTol(resistance.val,tolerance.val);
    maximum.fromResTol(resistance.val,tolerance.val);    

    outFull.innerHTML = eNotation.val +  " Ω ± " + (tolerance.val*100) + "%";
    
    var enMin = rMath.toENot(minimum.val);
    var enMax = rMath.toENot(maximum.val);

    outMM.innerHTML = enMin + " to " + enMax + " Ohms";
    cBands.updateBands();

});

inB3T.addEventListener("input", function(){
    if (parseFloat(this.value) >= 0 && parseFloat(this.value) <= 1000000000){
        band3.val = parseFloat(this.value);
        band3.updateSelect(this.value);
        inRes.value = resistance.fromBands(band1.val,band2.val,band3.val);
        inENot.value = eNotation.fromRes(resistance.val);

        minimum.fromResTol(resistance.val,tolerance.val);
        maximum.fromResTol(resistance.val,tolerance.val);    

        outFull.innerHTML = eNotation.val +  " Ω ± " + (tolerance.val*100) + "%";
        
        var enMin = rMath.toENot(minimum.val);
        var enMax = rMath.toENot(maximum.val);

        outMM.innerHTML = enMin + " to " + enMax + " Ohms";
        cBands.updateBands();
    } else {
        console.warn("script.js: inB2T: second digit band value out of range");
    }
});

inB3S.addEventListener("input", function(){
    switch (this.value){
        case "black":
            inB3T.value = band3.val = 1;
            break;
        case "brown":
            inB3T.value = band3.val = 10;
            break;
        case "red":
            inB3T.value = band3.val = 100;
            break;
        case "orange":
            inB3T.value = band3.val = 1000;
            break;
        case "yellow":
            inB3T.value = band3.val = 10000;
            break;
        case "green":
            inB3T.value = band3.val = 100000;
            break;
        case "blue":
            inB3T.value = band3.val = 1000000;
            break;
        case "violet":
            inB3T.value = band3.val = 10000000;
            break;
        case "grey":
            inB3T.value = band3.val = 100000000;
            break;
        case "white":
            inB3T.value = band3.val = 1000000000;
            break;
        case "gold":
            inB3T.value = band3.val = .1;
            break;
        case "silver":
            inB3T.value = band3.val = .01;
            break;

        default:
            console.error("script.js: inB3S: you broke this");
    }
    inRes.value = resistance.fromBands(band1.val,band2.val,band3.val);
    inENot.value = eNotation.fromRes(resistance.val);

    minimum.fromResTol(resistance.val,tolerance.val);
    maximum.fromResTol(resistance.val,tolerance.val);    

    outFull.innerHTML = eNotation.val +  " Ω ± " + (tolerance.val*100) + "%";
    
    var enMin = rMath.toENot(minimum.val);
    var enMax = rMath.toENot(maximum.val);

    outMM.innerHTML = enMin + " to " + enMax + " Ohms";
    cBands.updateBands();

});

inB4T.addEventListener("input", function() {
    if (isNaN(parseFloat(this.value))){
        console.warn("script.js: inB4T: cannot parse tolerance input");
    } else  if (parseFloat(this.value) <= 0) {
        console.warn("script.js: inB4T: tolerance value out of range");
    } else {
        band4.updateSelect(this.value);

        // tolerance.val = this.value*.01;
        inTol.value = tolerance.fromBands(this.value*.01)*100;

        minimum.fromResTol(resistance.val,tolerance.val);
        maximum.fromResTol(resistance.val,tolerance.val);    

        outFull.innerHTML = eNotation.val +  " Ω ± " + (tolerance.val*100) + "%";
        
        var enMin = rMath.toENot(minimum.val);
        var enMax = rMath.toENot(maximum.val);
        
        outMM.innerHTML = enMin + " to " + enMax + " Ohms";
        cBands.updateBands();
    }
});

inB4S.addEventListener("input", function(){
    switch (this.value){
        case "blank":
            inB4T.value = band4.val = 20;
            break;
        case "brown":
            inB4T.value = band4.val = 1;
            break;
        case "red":
            inB4T.value = band4.val = 2;
            break;
        case "green":
            inB4T.value = band4.val = .5;
            break;
        case "blue":
            inB4T.value = band4.val = .25;
            break;
        case "violet":
            inB4T.value = band4.val = .1;
            break;
        case "grey":
            inB4T.value = band4.val = .01;
            break;
        case "gold":
            inB4T.value = band4.val = 5;
            break;
        case "silver":
            inB4T.value = band4.val = 10;
            break;
        default:
            console.error("script.js: inB4S: you broke this");
    }
    
    inTol.value = tolerance.fromBands(band4.val*.01)*100;

    minimum.fromResTol(resistance.val,tolerance.val);
    maximum.fromResTol(resistance.val,tolerance.val);    

    outFull.innerHTML = eNotation.val +  " Ω ± " + (tolerance.val*100) + "%";
    
    var enMin = rMath.toENot(minimum.val);
    var enMax = rMath.toENot(maximum.val);
    console.log(enMin + " " + enMax);
    
    outMM.innerHTML = enMin + " to " + enMax + " Ohms";
    cBands.updateBands();
})
//eof