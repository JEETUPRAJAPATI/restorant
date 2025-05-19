// Import stock photos from provided URLs
export const images = {
  // Restaurant interiors
  restaurantInteriors: [
    "https://pixabay.com/get/g60792b4e5c0c6cf12caab98004ce568476b8bec7bbbb38c9a3c3da07e9fa9f3036e8b57358926b934fb610d7783fe83c8432bddf3595d41bf36da9ead7cb7e3f_1280.jpg",
    "https://pixabay.com/get/g7975f781021705115eeef674848ef35a02c7a847d4523a0d597282a57d2cfa91436c9c4db2ae4cc5465569b4c4ab3d83127aa551192941066f8451bdc6cbedf4_1280.jpg",
    "https://pixabay.com/get/gf91de6caeb1fd9fa7157978faa96e575113983ebc4f627cdf7badab06852c6fe9bfc88ede4ed4e2dcd6537b61e8ec171909db429cd8f63ec276c32487e41e983_1280.jpg",
    "https://pixabay.com/get/gc7dde8a8cf4f89bd8a3f1dabed71e871e68d56830635fd10e84505d5cce5eb2293819196ca84360a27eb24e68780454c7c3cc82037680be0fa7762db6b10e4be_1280.jpg",
    "https://pixabay.com/get/g6e8f238ec65646adf6286052cbfa078d85a4c530372fd17b9cb7624044ade034fc01646b0926bd1e1336e107a82480395e80168c036f5e90985f27f5b70476d8_1280.jpg",
    "https://pixabay.com/get/gd06481291f7d41ea601e07da046d96c16ca474bcddcbcf9d38163c75b8a098dbf4c04473f74ff541aabab387a1aadd78efaebdf89943b7299da93b01d62036d6_1280.jpg",
  ],
  
  // Food platters
  foodPlatters: [
    "https://pixabay.com/get/g1c1ead61d2e59c43b7dff0ecda34eec04482e78c273f1151216e66cbbbe21d90f69f3318862885c8b3be60af350f0e0e3cf1d5591d5aa72a1d21463ed029dac0_1280.jpg",
    "https://pixabay.com/get/g45eb5c8e37c42765146e91360dcd53e9370c34e658ba150e6928dcad6a38205daa407126ef154a55040f3a525f24c7cce0a02b681f5e60429f6fcf2694e79dd7_1280.jpg",
    "https://pixabay.com/get/g820cf851572c22b72c89209839281e1b00acb2c6a67744045d73c4e8fb0698c486f5c5f6d8f075ac6c8164e4476cc96efaeb221ff83481ea0f82ac11d4920db4_1280.jpg",
    "https://pixabay.com/get/gd893f216f3b905c3609204dcbb2651d52a5dd8b24a84b4df24724885ed229a8b986aa13e517066b1ac3d3d04a381d32bc6a523d85907e442420242ed0a754c5b_1280.jpg",
    "https://pixabay.com/get/g6421df4ec41e20cc527bfbb73cac4b2b3f8445f2e5876d44c08d8046206b5d8acaca0e87c3f83ff1c4d4a366837e9984dc32d59c32b396a179035f76f2cb0518_1280.jpg",
    "https://pixabay.com/get/g94bdec717ee152cf03bbcb146e882df527bbc4334dfea8822e5cb1fb37a091cbfe93b74ef22cec321876afb990cc1b4014178d730c0e0a03535a2b6dd35c03af_1280.jpg",
  ],
  
  // Celebration events
  celebrationEvents: [
    "https://pixabay.com/get/gcfacf0012f04626301916d52aa40d9d5dba53321bf569ee8f7e429b7f9d9e2a476cf55918fa957a2a745d2b972fe0f0c49fd2712af276e315d195670431f53e1_1280.jpg",
    "https://pixabay.com/get/g1402eb9d21a63d4f3fdf99bbf5c8fd0768b1989934109ac975537e64c685cb68d0a4973b1df352f0045b661d8dc51570bff44577e37035249f92d6657666c173_1280.jpg",
    "https://pixabay.com/get/gbdbc1a9ffcebb1508b86dd9d7dfd909199939762ed87ce42eed7b4eda83f2d62528c1067ede550abe91ebf046eb1ab91fdfc5107f803a504888e53ddcf16e673_1280.jpg",
    "https://pixabay.com/get/g289dbd5580c7e1180bea279357f957c485d45a426f3b70f5c9cd9b4ee757905cac24f851f3d2cc28d8d7f9cd8398eaeb6673d3257851a40d728d4f3a9b8bbb8e_1280.jpg",
  ],

  // Default image for placeholder
  default: "https://pixabay.com/get/gcfacf0012f04626301916d52aa40d9d5dba53321bf569ee8f7e429b7f9d9e2a476cf55918fa957a2a745d2b972fe0f0c49fd2712af276e315d195670431f53e1_1280.jpg",
};

// Helper function to get a random image from a category
export const getRandomImage = (category) => {
  if (!images[category] || images[category].length === 0) {
    return images.default;
  }
  
  const randomIndex = Math.floor(Math.random() * images[category].length);
  return images[category][randomIndex];
};
