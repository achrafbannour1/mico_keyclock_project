import tweepy
import yaml
import sys
import logging
import os
import requests
import tempfile

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger()

creds = yaml.load(open('social_credentials.yml', 'r'), Loader=yaml.FullLoader)

# Initialize Tweepy client (for tweeting)
client = tweepy.Client(
    consumer_key=creds['twitter']['consumer_key'],
    consumer_secret=creds['twitter']['consumer_secret'],
    access_token=creds['twitter']['access_token'],
    access_token_secret=creds['twitter']['access_secret']
)

# Initialize Tweepy API (for media upload)
api = tweepy.API(
    tweepy.OAuth1UserHandler(
        consumer_key=creds['twitter']['consumer_key'],
        consumer_secret=creds['twitter']['consumer_secret'],
        access_token=creds['twitter']['access_token'],
        access_token_secret=creds['twitter']['access_secret']
    )
)

if len(sys.argv) < 2:
    print("Error: No tweet text provided")
    sys.exit(1)

tweet_text = sys.argv[1]
image_input = sys.argv[2] if len(sys.argv) > 2 else None

logger.info(f"Posting tweet: '{tweet_text}' with image input: {image_input}")

try:
    media_ids = None
    if image_input:
        # Check if image_input is a URL or local path
        if image_input.startswith(('http://', 'https://')):
            # Download the image to a temporary file
            response = requests.get(image_input, stream=True)
            response.raise_for_status()
            with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as temp_file:
                for chunk in response.iter_content(chunk_size=8192):
                    temp_file.write(chunk)
                image_path = temp_file.name
            logger.info(f"Downloaded image to temporary file: {image_path}")
        else:
            # Assume it's a local file path
            image_path = image_input
            if not os.path.exists(image_path):
                raise FileNotFoundError(f"Image file not found: {image_path}")

        # Upload the image to Twitter
        media = api.media_upload(filename=image_path)
        media_ids = [media.media_id_string]
        logger.info(f"Uploaded media with ID: {media_ids[0]}")

        # Clean up temporary file if it was downloaded
        if image_input.startswith(('http://', 'https://')):
            os.unlink(image_path)

    # Post the tweet with media if available
    response = client.create_tweet(text=tweet_text, media_ids=media_ids)
    print(f"Success: Tweet posted - ID: {response.data['id']}")
except Exception as e:
    print(f"Error: Failed to post tweet - {str(e)}")
    sys.exit(1)