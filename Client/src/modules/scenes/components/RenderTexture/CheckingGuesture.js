var CheckingGuesture = cc.Class.extend();


CheckingGuesture.vectorLength = function(vector){
    return Math.sqrt(vector.x*vector.x + vector.y*vector.y);
}

CheckingGuesture.distancePoint = function(point1, point2){
    return CheckingGuesture.vectorLength(cc.p(point1.x - point2.x, point1.y - point2.y));
}

CheckingGuesture.distance = function (x, y, phapTuyen, diem){
    return Math.abs(phapTuyen.x*(x-diem.x) + phapTuyen.y*(y-diem.y))/CheckingGuesture.vectorLength(phapTuyen)
}


CheckingGuesture.goc = function(vec1, vec2) {
    return (vec1.x*vec2.x + vec1.y*vec2.y)/(CheckingGuesture.vectorLength(vec1)*CheckingGuesture.vectorLength(vec2));
},


CheckingGuesture.pic1 = function(listPoint){
    if (listPoint.length < 10) return false;

    var left = listPoint[0];
    var mid = listPoint[0];
    var mid_mark = 0;
    var right = listPoint[0];

    for(var i = 1; i < listPoint.length; i++){
        if (left.x > listPoint[i].x) left = listPoint[i];
        if(right.x < listPoint[i].x) right = listPoint[i];

        if (mid.y < listPoint[i].y) {
            mid = listPoint[i];
            mid_mark = i;
        } 
    }

    var chiPhuong1 = cc.p(left.x - mid.x, left.y - mid.y);
    var chiPhuong2 = cc.p(right.x - mid.x, right.y - mid.y);
    var chiPhuongGiua = cc.p(0,-1);

    var goc1 = -chiPhuong1.y/(CheckingGuesture.vectorLength(chiPhuong1));
    var goc2 = -chiPhuong2.y/(CheckingGuesture.vectorLength(chiPhuong2));

    // log("aaaaaaaaaaa " + goc1);
    // log("aaaaaaaaaaa " + goc2);

    if (goc1 < 0.77 || goc1 > 0.93 || goc2 < 0.77 || goc2 > 0.93) return false;

    var a1 = CheckingGuesture.vectorLength(chiPhuong1);
    var a2 = CheckingGuesture.vectorLength(chiPhuong2);

    if (Math.abs(a1 - a2) > 50) return false;

    var phapTuyen1 = cc.p(-chiPhuong1.y, chiPhuong1.x);
    var phapTuyen2 = cc.p(-chiPhuong2.y, chiPhuong2.x);

    for(var i = 0; i < mid_mark; i++){
        // log(CheckingGuesture.distance(listPoint[i].x, listPoint[i].y, phapTuyen1, left));
        if (CheckingGuesture.distance(listPoint[i].x, listPoint[i].y, phapTuyen1, left) > 9) return false;
    }

    for(var i = mid_mark+1; i < listPoint.length; i++){
        // log(CheckingGuesture.distance(listPoint[i].x, listPoint[i].y, phapTuyen2, right));
        if (CheckingGuesture.distance(listPoint[i].x, listPoint[i].y, phapTuyen2, right) > 9) return false;
    }

    return true;
}


CheckingGuesture.pic3 = function(listPoint){
    if (listPoint.length < 10) return false;

    var p1 = listPoint[0];
    var pOp1 = listPoint[1];
    var p2 = listPoint[listPoint.length - 1];
    var pOp2 = listPoint[1];

    var max_l1 = CheckingGuesture.distancePoint(p1, pOp1);
    var max_l2 = CheckingGuesture.distancePoint(p2, pOp2);

    for (var i = 2 ; i < listPoint.length; i++) {
        var l1 = CheckingGuesture.distancePoint(listPoint[i], p1);
        var l2 = CheckingGuesture.distancePoint(listPoint[i], p2);

        if (max_l1 < l1) {
            max_l1 = l1;
            pOp1 = listPoint[i];
        }

        if (max_l2 < l2) {
            max_l2 = l2;
            pOp2 = listPoint[i];
        }
    }

    var tam = cc.p((p1.x+pOp1.x+p2.x+pOp2.x)/4, (p1.y+pOp1.y+p2.y+pOp2.y)/4);
    var r = (max_l1+max_l2)/4;

    for(var i = 0; i < listPoint.length; i++) {
        // log(Math.abs(CheckingGuesture.distancePoint(listPoint[i], tam) - r));
        if (Math.abs(CheckingGuesture.distancePoint(listPoint[i], tam) - r) > 12) {
            // log("aaaaaaaaaaa");
            return false;
        }
    }

    var first = listPoint[0];
    var last = listPoint[listPoint.length-1];

    var vect1 = cc.p(first.x - tam.x, first.y - tam.y);
    var vect2 = cc.p(last.x - tam.x, last.y - tam.y);
    var vectGiua = cc.p(0, 1);

    var goc1 = CheckingGuesture.goc(vect1, vectGiua);
    var goc2 = CheckingGuesture.goc(vect2, vectGiua);

    // log("goc 1: " + goc1);
    // log("log 2: " + goc2);

    if(goc1 < 0.7 || goc1 > 0.9 || goc2 < 0.7 || goc2 > 0.9) return false;

    return true;
}


CheckingGuesture.pic5 = function(listPoint){
    if (listPoint.length < 10) return false;

    var left = listPoint[0];
    var right = listPoint[0];
    for(var i = 1; i < listPoint.length; i++){
        if (left.x > listPoint[i].x) left = listPoint[i];
        if(right.x < listPoint[i].x) right = listPoint[i];
    }

    for(var i = 0; i < listPoint.length; i++){
        if (Math.abs(listPoint[i].y - left.y) > 9) return false;
    }

    if (right.x - left.x < 70 || right.x - left.x > 250) return false;
    return true;
}


CheckingGuesture.pic6 = function(listPoint){
    if (listPoint.length < 10) return false;

    var left = listPoint[0];
    var mid = listPoint[0];
    var mid_mark = 0;
    var right = listPoint[0];

    for(var i = 1; i < listPoint.length; i++){
        if (left.x > listPoint[i].x) left = listPoint[i];
        if(right.x < listPoint[i].x) right = listPoint[i];

        if (mid.y > listPoint[i].y) {
            mid = listPoint[i];
            mid_mark = i;
        } 
    }

    var chiPhuong1 = cc.p(left.x - mid.x, left.y - mid.y);
    var chiPhuong2 = cc.p(right.x - mid.x, right.y - mid.y);
    var chiPhuongGiua = cc.p(0,1);

    var goc1 = chiPhuong1.y/(CheckingGuesture.vectorLength(chiPhuong1));
    var goc2 = chiPhuong2.y/(CheckingGuesture.vectorLength(chiPhuong2));

    // log("aaaaaaaaaaa " + goc1);
    // log("aaaaaaaaaaa " + goc2);

    if (goc1 < 0.77 || goc1 > 0.93 || goc2 < 0.77 || goc2 > 0.93) return false;

    var a1 = CheckingGuesture.vectorLength(chiPhuong1);
    var a2 = CheckingGuesture.vectorLength(chiPhuong2);

    if (Math.abs(a1 - a2) > 50) return false;

    var phapTuyen1 = cc.p(-chiPhuong1.y, chiPhuong1.x);
    var phapTuyen2 = cc.p(-chiPhuong2.y, chiPhuong2.x);

    for(var i = 0; i < mid_mark; i++){
        // log(CheckingGuesture.distance(listPoint[i].x, listPoint[i].y, phapTuyen1, left));
        if (CheckingGuesture.distance(listPoint[i].x, listPoint[i].y, phapTuyen1, left) > 9) return false;
    }

    for(var i = mid_mark+1; i < listPoint.length; i++){
        // log(CheckingGuesture.distance(listPoint[i].x, listPoint[i].y, phapTuyen2, right));
        if (CheckingGuesture.distance(listPoint[i].x, listPoint[i].y, phapTuyen2, right) > 9) return false;
    }

    return true;
}


CheckingGuesture.pic7 = function(listPoint){
    if (listPoint.length < 10) return false;

    var up = listPoint[0];
    var down = listPoint[0];
    for(var i = 1; i < listPoint.length; i++){
        if (up.y < listPoint[i].y) up = listPoint[i];
        if(down.y > listPoint[i].y) down = listPoint[i];
    }

    for(var i = 0; i < listPoint.length; i++){
        if (Math.abs(listPoint[i].x - up.x) > 9) return false;
    }

    if (up.y - down.y < 70 || up.y - down.y > 250) return false;
    return true;
}


CheckingGuesture.pic8 = function(listPoint){
    if (listPoint.length < 10) return false;

    var p1 = listPoint[0];
    var pOp1 = listPoint[1];
    var p2 = listPoint[listPoint.length - 1];
    var pOp2 = listPoint[1];

    var max_l1 = CheckingGuesture.distancePoint(p1, pOp1);
    var max_l2 = CheckingGuesture.distancePoint(p2, pOp2);

    for (var i = 2 ; i < listPoint.length; i++) {
        var l1 = CheckingGuesture.distancePoint(listPoint[i], p1);
        var l2 = CheckingGuesture.distancePoint(listPoint[i], p2);

        if (max_l1 < l1) {
            max_l1 = l1;
            pOp1 = listPoint[i];
        }

        if (max_l2 < l2) {
            max_l2 = l2;
            pOp2 = listPoint[i];
        }
    }

    var tam = cc.p((p1.x+pOp1.x+p2.x+pOp2.x)/4, (p1.y+pOp1.y+p2.y+pOp2.y)/4);
    var r = (max_l1+max_l2)/4;

    for(var i = 0; i < listPoint.length; i++) {
        // log(Math.abs(CheckingGuesture.distancePoint(listPoint[i], tam) - r));
        if (Math.abs(CheckingGuesture.distancePoint(listPoint[i], tam) - r) > 12) {
            // log("aaaaaaaaaaa");
            return false;
        }
    }

    var first = listPoint[0];
    var last = listPoint[listPoint.length-1];

    var vect1 = cc.p(first.x - tam.x, first.y - tam.y);
    var vect2 = cc.p(last.x - tam.x, last.y - tam.y);
    var vectGiua = cc.p(1, 0);

    var goc1 = CheckingGuesture.goc(vect1, vectGiua);
    var goc2 = CheckingGuesture.goc(vect2, vectGiua);

    // log("goc 1: " + goc1);
    // log("log 2: " + goc2);

    if(goc1 < 0.7 || goc1 > 0.9 || goc2 < 0.7 || goc2 > 0.9) return false;

    return true;
}


CheckingGuesture.pic9 = function(listPoint){
    if (listPoint.length < 10) return false;

    if (listPoint[1].x - listPoint[0].x < 0){
        listPoint = listPoint.reverse();
    }


    var up1 = listPoint[0];

    var i1 = 0;
    while(i1+1 < listPoint.length && listPoint[i1+1].x > listPoint[i1].x) {
        i1++;
    }

    var up2 = listPoint[i1];

    // Check up edge
    for(var i = 0; i <= i1; i++){
        if (Math.abs(listPoint[i].y - up1.y) > 9){
            // log("aaaaaaaaaaaa");
            return false;
        }
    }
    
    var down1 = listPoint[listPoint.length - 1];

    var i2 = listPoint.length - 1;
    while(i2 > 0 && listPoint[i2-1].x < listPoint[i2].x){
        i2--;
    }

    // if it doesn't have down edge
    if(i2 == listPoint.length - 1 || i2 == 0) {
        // log("bbbbbbbbbbbbbbb");
        return false;
    }

    // Check down edge
    for(var i = i2; i < listPoint.length; i++){
        if (Math.abs(listPoint[i].y - down1.y) > 9){
            // log("cccccccccc");
            return false;
        }
    }

    var down2 = listPoint[i2];

    // up1 --- up2
    //         /
    //        /
    //       /
    //   donw2 --- down1

    var chiPhuongUp = cc.p(up1.x - up2.x, up1.y - up2.y);
    var chiPhuongDown = cc.p(down1.x - down2.x, down1.y - down2.y);
    var chiPhuongCheoUp = cc.p(down2.x - up2.x, down2.y - up2.y);
    var chiPhuongCheoDown = cc.p(up2.x - down2.x, up2.y - down2.y);

    var gocUp = CheckingGuesture.goc(chiPhuongUp, chiPhuongCheoUp);
    var gocDown = CheckingGuesture.goc(chiPhuongDown, chiPhuongCheoDown);

    // log("goc up: " + gocUp);
    // log("goc down: " + gocDown);

    if (gocUp < 0.55 || gocUp > 0.85 || gocDown < 0.55 || gocDown > 0.85) {
        // log("dddddddddddddddddddddddddd");
        return false;
    }

    for (var i = i1; i <= i2; i++){
        // log(CheckingGuesture.distance(listPoint[i].x, listPoint[i].y, cc.p(-chiPhuongCheoUp.y, chiPhuongCheoUp.x), up2));
        if(CheckingGuesture.distance(listPoint[i].x, listPoint[i].y, cc.p(-chiPhuongCheoUp.y, chiPhuongCheoUp.x), up2) > 9) {
            return false;
        }
    }

    var canh1 = CheckingGuesture.vectorLength(chiPhuongUp);
    var canh2 = CheckingGuesture.vectorLength(chiPhuongCheoUp);
    var canh3 = CheckingGuesture.vectorLength(chiPhuongDown);

    var dist1 = Math.abs(canh1 - canh2);
    var dist2 = Math.abs(canh3 - canh2);
    var dist3 = Math.abs(canh1 - canh3);

    // log("dist 1: " + dist1);
    // log("dist 2: " + dist2);
    // log("dist 3: " + dist3);

    if(dist1 > 50 || dist2 > 50 || dist3 > 50) {
        return false;
    }

    return true;
}


CheckingGuesture.pic11 = function(listPoint){
    if (listPoint.length < 10) return false;

    if (listPoint[1].y - listPoint[0].y < 0){
        listPoint = listPoint.reverse();
    }


    var left1 = listPoint[0];

    var i1 = 0;
    while(i1+1 < listPoint.length && listPoint[i1+1].y > listPoint[i1].y) {
        i1++;
    }

    var left2 = listPoint[i1];

    // Check left edge
    for(var i = 0; i <= i1; i++){
        if (Math.abs(listPoint[i].x - left1.x) > 9){
            // log("aaaaaaaaaaaa");
            return false;
        }
    }
    
    var right1 = listPoint[listPoint.length - 1];

    var i2 = listPoint.length - 1;
    while(i2 > 0 && listPoint[i2-1].y < listPoint[i2].y){
        i2--;
    }

    // if it doesn't have right edge
    if(i2 == listPoint.length - 1 || i2 == 0) {
        // log("bbbbbbbbbbbbbbb");
        return false;
    }

    // Check right edge
    for(var i = i2; i < listPoint.length; i++){
        if (Math.abs(listPoint[i].x - right1.x) > 9){
            // log("cccccccccc");
            return false;
        }
    }

    var right2 = listPoint[i2];

    // left2    right1
    //   |  \      |
    //   |   \     |
    //   |    \    |
    // left1     right2

    var chiPhuongLeft = cc.p(left1.x - left2.x, left1.y - left2.y);
    var chiPhuongRight = cc.p(right1.x - right2.x, right1.y - right2.y);
    var chiPhuongCheoLeft = cc.p(right2.x - left2.x, right2.y - left2.y);
    var chiPhuongCheoRight = cc.p(left2.x - right2.x, left2.y - right2.y);

    var gocLeft = CheckingGuesture.goc(chiPhuongLeft, chiPhuongCheoLeft);
    var gocRight = CheckingGuesture.goc(chiPhuongRight, chiPhuongCheoRight);

    // log("goc left: " + gocLeft);
    // log("goc right: " + gocRight);

    if (gocLeft < 0.55 || gocLeft > 0.85 || gocRight < 0.55 || gocRight > 0.85) {
        // log("dddddddddddddddddddddddddd");
        return false;
    }

    for (var i = i1; i <= i2; i++){
        // log(CheckingGuesture.distance(listPoint[i].x, listPoint[i].y, cc.p(-chiPhuongCheoUp.y, chiPhuongCheoUp.x), up2));
        if(CheckingGuesture.distance(listPoint[i].x, listPoint[i].y, cc.p(-chiPhuongCheoLeft.y, chiPhuongCheoLeft.x), left2) > 9) {
            return false;
        }
    }

    var canh1 = CheckingGuesture.vectorLength(chiPhuongLeft);
    var canh2 = CheckingGuesture.vectorLength(chiPhuongCheoLeft);
    var canh3 = CheckingGuesture.vectorLength(chiPhuongRight);

    var dist1 = Math.abs(canh1 - canh2);
    var dist2 = Math.abs(canh3 - canh2);
    var dist3 = Math.abs(canh1 - canh3);

    // log("dist 1: " + dist1);
    // log("dist 2: " + dist2);
    // log("dist 3: " + dist3);

    if(dist1 > 50 || dist2 > 50 || dist3 > 50) {
        return false;
    }

    return true;
}