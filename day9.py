import os
Fruits = {
    "apple": "saib",
    "banana": "kela",
    "grape": "angoor",
    "orange": "santara",
    "mango": "aam"
}

# while True:
#     userInput = input("Enter any fruit name = ").lower()
#     if userInput in Fruits:
#         print(Fruits[userInput])
#     elif userInput not in Fruits:
#         print("Fruit not found in the dictionary")
#         userPer = input(f"Do you Want to add {userInput} in Fruit Basket ? YES/NO ").lower()
#         if userPer == "yes":
#             mean = input(f"Enter the meaning of {userInput} = ")
#             Fruits.update({userInput: mean})
#             print("Fruit added successfully")
#             if os.path.exists:
#                 file = open("dictonary.txt", "a")
#                 file.write(f"\n{userInput} : {mean}")
#             else:
#                 file = open("dictionary.txt", "x")
#                 file.write(str(Fruits))
#             print(Fruits)
#         else:
#             print("Thank you")
#             break

while True:
    userInput = input("Enter any fruit name = ").lower()
    if userInput in Fruits:
        print(Fruits[userInput])
    elif userInput not in Fruits:
        print("Fruit not found in the dictionary")
        userPer = input(f"Do you Want to add {userInput} in Fruit Basket ? YES/NO ").lower()
        if userPer == "yes":
            mean = input(f"Enter the meaning of {userInput} = ")
            Fruits.update({userInput: mean})
            print("Fruit added successfully")
            with open("dictonary.txt", "w") as file:
                file.write(str(Fruits))
            print(Fruits)
        else:
            print("Thank you")
            break