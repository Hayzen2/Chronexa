import { UserRepository } from "../repository/userRepository.ts";
import { UserDTO } from "../dto/userDTO.ts";
import { UpdateProfileRequestDTO } from "../dto/requests/updateProfileDTO.ts";
import { User } from "../entity/userEntity.ts";

export class UserService {
    private readonly userRepository = UserRepository;

    // Internal use
    async getUserById(id: string) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }

    // External use
    async getUserProfile(id: string): Promise<UserDTO> {
        const user = await this.getUserById(id);
        return this.toUserDTO(user);
    }

    async updateUserProfile(id: string, updateData: Partial<UpdateProfileRequestDTO>): Promise<UserDTO> {
        const user = await this.getUserById(id);

        if (updateData.username) {
            const existingUser = await this.userRepository.findOne({ where: { username: updateData.username } });
            if (existingUser && existingUser.id !== id) {
                throw new Error('Username already exists');
            }
        }
        
        Object.assign(user, updateData); // Update user with new data
        const updatedUser = await this.userRepository.save(user);
        return this.toUserDTO(updatedUser);
    }

    async deleteUser(id: string): Promise<{ message: string }> {
        const user = await this.getUserById(id);
        await this.userRepository.remove(user);
        // since remove doesn't return anything
        return { message: 'User deleted successfully' }; 
    }

    private toUserDTO(user: User) {
        return {
            id: user.id,
            username: user.username,
            email: user.email,
            avatarUrl: user.avatarUrl
        };
    }

}