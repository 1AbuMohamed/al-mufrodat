1t1sGv/AH677JxsIhRCQhdcKVCkNBu8ycHvfbdwx9sdpBzOBh36cErLyppjBUxk6Bw2Dc2DlRklcJHnopMeSIkcwiyOIoXIYyzPJK1sRHtGTfAaj6qENjInCm5i1wZ+MZGGbtrJILU3nyy6Uwh37OhvXz8wtuPP3v0FJTKaPJpAHKV0zfFCppdKnVRRBwbjDYpFCUA/Oq23Onf/MmXYUvSVVVx8dXN93lK5FyU1dI+FNOgvVY7wKaisRzF0Cgw56Q6+DZinPKUua61guffffJY2OePoDoewSfVIT/DxtWI2Fr9vwsmNwSUpgAA";
  function b64ToU8(b64){
    if (typeof Buffer !== 'undefined') return new Uint8Array(Buffer.from(b64, 'base64'));
    var bin = atob(b64), u8 = new Uint8Array(bin.length);
    for (v