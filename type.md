# Window Content Types

Use these JSON snippets for the `content` array entries.

- Text  
  ```json
  {"type":"text","text":"Your message"}
  ```

- Image  
  ```json
  {"type":"image","url":"https://example.com/image.jpg"}
  ```

- Video file (mp4)  
  ```json
  {"type":"video-file","url":"https://example.com/video.mp4"}
  ```

- YouTube  
  ```json
  {"type":"youtube","url":"https://youtu.be/xyz"}
  ```

- Spotify  
  ```json
  {"type":"spotify","url":"https://open.spotify.com/track/abc"}
  ```

- Gallery (multiple images)  
  ```json
  {"type":"gallery","images":["https://example.com/1.jpg","https://example.com/2.jpg"]}
  ```

- Link button  
  ```json
  {"type":"link","url":"https://example.com","label":"Open link"}
  ```

- Placeholder  
  ```json
  {"type":"placeholder","text":"Coming soon"}
  ```

- Quiz gate (two items: quiz first, real content second)  
  ```json
  [
    {
      "type":"quiz",
      "question":"What is 2+2?",
      "answers":[{"text":"4","isCorrect":true},{"text":"3","isCorrect":false}]
    },
    {
      "type":"image",
      "url":"https://example.com/reward.jpg"
    }
  ]
  ```
