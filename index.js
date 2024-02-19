const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();
const PORT = 5000;

// Default Get Route send data on how to call instagram and TikTok routes
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the Social Media Scraper API",
    instagram: {
      route: "/instagram/:username",
      description: "Get the data from the Instagram profile",
    },
    tiktok: {
      route: "/tiktok/:username",
      description: "Get the data from the TikTok profile",
    },
  });
});

//Get the data from the Instagram profile
app.get("/instagram/:username", async (req, res) => {
  try {
    const response = await axios.get(
      `https://www.instagram.com/${req.params.username}/?__a=1`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
      }
    );

    // const response = await axios.get(
    //   `https://www.instagram.com/${req.params.username}/?__a=1`,
    // );
  
    const $ = cheerio.load(response.data);
    const metaContent = $('meta[property="og:description"]').attr("content");
    console.log(metaContent);
    const userData = metaContent
      .replace(/Followers|Following|Posts/g, "")
      .split("-")[0]
      .split(",");

    function convertToNumber(arr) {
      return arr.map((item) => {
        const num = parseFloat(item);
        let value = item;
        if (item.includes("M")) {
          value = num * 1e6;
        } else if (item.includes("K")) {
          value = num * 1e3;
        } else if (item.includes("B")) {
          value = num * 1e9;
        } else {
          value = num;
        }
        return { number: value, text: item.trim() };
      });
    }

    // Convert and assign to variables
    const [followersData, followingData, postsData] = convertToNumber(userData);

    // Send the extracted data as JSON
    res.json({
      username: req.params.username,
      followers: followersData.number,
      followers_text: followersData.text,
      following: followingData.number,
      following_text: followingData.text,
      posts: postsData.number,
      posts_text: postsData.text,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the data." });
  }
});

//Get data from TikTok profile
app.get("/tiktok/:username", async (req, res) => {
  try {
    const response = await axios.get(
      `https://www.tiktok.com/@${req.params.username}`
    );
    console.log(response.data);
    const $ = cheerio.load(response.data);
    const metaContent = $('meta[property="og:description"]').attr("content");

    const userData = metaContent.split("Followers")[0].split(",");

    function convertToNumber(arr) {
      return arr.map((item) => {
        const num = parseFloat(item);
        let value = item;
        if (item.includes("M")) {
          value = num * 1e6;
        } else if (item.includes("K")) {
          value = num * 1e3;
        } else if (item.includes("B")) {
          value = num * 1e9;
        } else {
          value = num;
        }
        return { number: value, text: item.trim() };
      });
    }

    // Convert and assign to variables
    const [followersData, followingData, likesData] = convertToNumber(userData);

    // Send the extracted data as JSON
    res.json({
      username: req.params.username,
      followers: followersData.number,
      followers_text: followersData.text,
      following: followingData.number,
      following_text: followingData.text,
      likes: likesData.number,
      likes_text: likesData.text,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the data." });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
