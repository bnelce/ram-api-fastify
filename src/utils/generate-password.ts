export function generatePassword(length: number): string {
    const uppercaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseLetters = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    // const specialChars = '!@#$%^&*()_+[]{}|;:,.<>?';
    
    const allChars = uppercaseLetters + lowercaseLetters + numbers;
    let password = '';
    
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * allChars.length);
        password += allChars[randomIndex];
    }
    
    return password;
}