package esprit.productgestion.Services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.File;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class TwitterService {

    private static final Logger logger = LoggerFactory.getLogger(TwitterService.class);

    @Value("${python.path:/usr/bin/python3}")
    private String pythonPath;

    public String postTweet(String text, String imageUrl) throws Exception {
        if (text == null || text.trim().isEmpty()) {
            throw new IllegalArgumentException("Tweet text cannot be empty");
        }

        // Create a temporary directory for the script
        Path tempDir = Files.createTempDirectory("twitter-script");
        File tempScriptFile = new File(tempDir.toFile(), "post_tweet.py");

        // Load the Python script from the classpath
        ClassPathResource scriptResource = new ClassPathResource("scripts/post_tweet.py");
        if (!scriptResource.exists()) {
            throw new IllegalStateException("Python script not found in classpath: scripts/post_tweet.py");
        }

        // Copy the script to the temporary directory
        Files.copy(scriptResource.getInputStream(), tempScriptFile.toPath());

        // Ensure social_credentials.yml is also copied to the temporary directory
        ClassPathResource credsResource = new ClassPathResource("social_credentials.yml");
        if (!credsResource.exists()) {
            throw new IllegalStateException("Credentials file not found in classpath: social_credentials.yml");
        }
        File tempCredsFile = new File(tempDir.toFile(), "social_credentials.yml");
        Files.copy(credsResource.getInputStream(), tempCredsFile.toPath());

        logger.info("Resolved script path: {}", tempScriptFile.getAbsolutePath());
        logger.info("Resolved working directory: {}", tempDir.toAbsolutePath());

        // Build the command
        ProcessBuilder pb;
        if (imageUrl != null && !imageUrl.trim().isEmpty()) {
            pb = new ProcessBuilder(pythonPath, tempScriptFile.getAbsolutePath(), text, imageUrl);
            logger.info("Executing Python script with image: {} {} '{}' '{}'", pythonPath, tempScriptFile.getAbsolutePath(), text, imageUrl);
        } else {
            pb = new ProcessBuilder(pythonPath, tempScriptFile.getAbsolutePath(), text);
            logger.info("Executing Python script without image: {} {} '{}'", pythonPath, tempScriptFile.getAbsolutePath(), text);
        }

        pb.directory(tempDir.toFile());
        pb.redirectErrorStream(true);

        try {
            Process process = pb.start();
            StringBuilder output = new StringBuilder();
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line).append("\n");
                logger.debug("Script output: {}", line);
            }

            int exitCode = process.waitFor();
            String result = output.toString().trim();

            if (exitCode == 0 && result.contains("Success")) {
                String tweetId = result.split("ID: ")[1];
                logger.info("Tweet posted successfully with ID: {}", tweetId);
                return "Tweet posted successfully: " + tweetId;
            } else {
                logger.error("Python script failed with exit code {}: {}", exitCode, result);
                throw new Exception("Failed to post tweet: " + result);
            }
        } catch (Exception e) {
            logger.error("Error executing Python script: {}", e.getMessage());
            throw new Exception("Error posting tweet: " + e.getMessage(), e);
        } finally {
            // Clean up temporary files
            try {
                Files.deleteIfExists(tempScriptFile.toPath());
                Files.deleteIfExists(tempCredsFile.toPath());
                Files.deleteIfExists(tempDir);
            } catch (Exception e) {
                logger.warn("Failed to delete temporary files: {}", e.getMessage());
            }
        }
    }
}