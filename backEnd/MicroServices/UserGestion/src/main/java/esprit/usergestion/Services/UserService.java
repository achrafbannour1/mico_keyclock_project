package esprit.usergestion.Services;

import esprit.usergestion.Entities.User;
import esprit.usergestion.Entities.UserRole;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import esprit.usergestion.Repository.UserRepository;

import java.util.List;
import java.util.logging.Logger;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private static final Logger logger = Logger.getLogger(UserService.class.getName());

    @Transactional
    public User updateUserRole(Long userId, UserRole newRole) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        user.setRole(newRole);
        logger.info("Updated role for user with ID " + userId + " to: " + newRole);
        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Transactional
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        userRepository.delete(user);
        logger.info("User with ID " + userId + " deleted successfully");
    }
}