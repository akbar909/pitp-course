# Hidden Code Finder
Solution: 54321
def find_hidden_code():
    for d1 in range(9, 0, -1):
        for d2 in range(d1 - 1, -1, -1):
            for d3 in range(d2 - 1, -1, -1):
                for d4 in range(d3 - 1, -1, -1):
                    for d5 in range(d4 - 1, -1, -1):
                        if d1 + d2 + d3 + d4 + d5 == 15 and d1 == 5:
                            code = f"{d1}{d2}{d3}{d4}{d5}"
                            print("Hidden code found:", code)
                            return code
find_hidden_code()

# LEVEL 1 - Crack the Login
def level_1_crack_the_login():  
    print("LEVEL 1")
    print("Mission: Admin login system ko hack karein.")
    print("Aapke paas 3 chances hain.")
    
    try:
        with open("passwords.txt", "r") as file:
            valid_passwords = [line.strip() for line in file.readlines()]
    except FileNotFoundError:
        print("Error: passwords.txt file nahi mila. Phir se koshish karein.")
        return

    chances = 3
    while chances > 0:
        guess = input(f"Password guess karein ({chances} chances baki): ").strip()

        if guess in valid_passwords:
            print("\nACCESS GRANTED. Aapne admin password crack kar liya hai!")
            return

        chances -= 1 
        if chances > 0:
            print("Password galat hai. Dobara koshish karein.")
           
        else:
            print("\nACCESS DENIED. 3 galat koshishein. Game Over!")
            return


level_1_crack_the_login()

# LEVEL 2 – Trace the Hidden Keyword

import time
def level_2_trace_hidden_keyword():  
    print("LEVEL 2")
    print("Mission: Crack Hidden Keyword.")
    print("Aapke paas 30 seconds hain.")
    
    try:
        with open("clue.txt", "r") as file:
            hidden_keyword = file.read().strip()
    except FileNotFoundError:
        print("Error: clue.txt file nahi mila. Phir se koshish karein.")
        return

    start_time = time.time()

    while time.time() - start_time < 10:
        userInput = input("Find hidden keyword = ").strip()
        if userInput == hidden_keyword:
            print("Aapne dhund liya hidden keyword:", hidden_keyword)
            return
        else:
            print("Galat jawab. Dobara koshish karein.")
    
    print("\nTime's up! Aap hidden keyword nahi dhundh paye.")
    
level_2_trace_hidden_keyword()

# LEVEL 3 – Decode the Cipher
import time
def level_3_decode_the_cipher():
    print("\nLEVEL 3")
    print("Mission: encrypted.txt file se cipher decode karein.")

    def caesar_decrypt(ciphertext, shift=3):
        decrypted = []
        for char in ciphertext:
            if char.isalpha():
                offset = 65 if char.isupper() else 97
                decrypted_char = chr((ord(char) - offset - shift) % 26 + offset)
                decrypted.append(decrypted_char)
            else:
                decrypted.append(char)
        return ''.join(decrypted)

    try:
        with open("encrypted.txt", "r") as file:
            encrypted_message = file.read().strip()
            decrypted_message = caesar_decrypt(encrypted_message)
    except FileNotFoundError:
        print("Error: encrypted.txt file nahi mila. Phir se koshish karein.")
        return

    user_input = input("Decrypted message kya hai? ").strip()
    if user_input == decrypted_message:
        print("Correct! Aapne cipher decode kar liya hai:", decrypted_message)
    else:
        print("Galat jawab. Sahi message tha:", decrypted_message)
        
level_3_decode_the_cipher()

# LEVEL 4 – Defuse the Bomb

def level_4_defuse_the_bomb():
    print("\nLEVEL 4")
    print("Mission: Riddle solve karke bomb defuse karein.")
    print("Riddle: I speak without a mouth and hear without ears. What am I?")
    print("Aapke paas 3 chances hain.")

    correct_answer = "echo"
    chances = 3

    while chances > 0:
        answer = input(f"Your answer ({chances} chances left): ").strip().lower()
        if answer == correct_answer:
            with open("bomb.txt", "w") as file:
                file.write("Bomb defused successfully!")
            print("Congratulations! Aapne bomb defuse kar diya hai.")
            return
        else:
            chances -= 1
            if chances > 0:
                print("Galat jawab. Dobara koshish karein.")
            else:
                with open("bomb.txt", "w") as file:
                    file.write("Bomb exploded!")
                print("Bomb exploded! Game Over.")

level_4_defuse_the_bomb()

# LEVEL 5 – Final Firewall
def level_5_final_firewall():
    print("\nLEVEL 5")
    print("Mission: Grid mein hidden weak point find karein.")
    print("Grid size: 5x5 (0-4 for both rows and columns)")
    print("Aapke paas 3 chances hain.")

    weak_point = (2, 2)
    chances = 3

    while chances > 0:
        try:
            user_input = input(f"Enter grid coordinates as row,col ({chances} chances left): ")
            row, col = map(int, user_input.split(","))
            if (row, col) == weak_point:
                print("Firewall breached! Mission complete.")
                return
            else:
                chances -= 1
                if chances > 0:
                    print("Galat coordinates. Dobara koshish karein.")
                else:
                    print("3 galat koshishein. Game Over!")
        except ValueError:
            print("Invalid input format. Please enter as row,col (e.g., 1,2).")
    
level_5_final_firewall()