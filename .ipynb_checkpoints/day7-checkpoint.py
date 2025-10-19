# for num in range(20):
#     if num%3 == 0 and num%5 == 0:
#         print(num , "DingDong")
#     elif num%3 == 0:
#         print(num , "Ding")
#     elif num%5 == 0:
#         print(num , "Dong")
#     else:
#         print(num , "DongDing")


# i = 0
# while i < 50:
#     if i%2 == 1:
#         print(i, "is odd")
#     else:
#         print(i , "is even")
#     i += 1

# randNum = 3
# attempt = 4
# while True:
#     print(f"you have {attempt} attempts")
#     userNum = int(input("Enter a number between 1 to 10: "))
#     if userNum == randNum:
#         print("You win")
#         break
#     else:
#         print("Try again")
#         attempt -= 1
#         if attempt == 0:
#             print("You lose")
#             break
        
# attempts , results if user guess within 5 attempts give score acc to 10 if user guess more 5 attempts give score acc to 5
# if user guess wrong 10 times game over
# if user guess correct in 1st attempt score 10

# attempts = 10
# score = 0
# randNum = 7
# while attempts > 0:
#     print(f"You have  {attempts} attempts")
#     userNum = input("Enter a number between 1 to 10: ")
#     if not userNum.isdigit():
#         print("Enter valid input, Only numbers")
#     else:
#         userNum = int(userNum)
#         if userNum == randNum:
#             if attempts >= 6:
#                 score = 10
#             else:
#                 score = 5
#             print(f"You win! Your score is {score}")
#             break
#         else:
#             attempts -= 1
#             print("Try again")
#             if attempts == 0:
#                 print("Game over! You've used all your attempts.")

# ran=18
# while True:
#     a=int(input("guess the correct num:"))
#     if a==ran:
#         print("Correct")
#         break
#     else:
#         print("Try again")

# ran=18
# while True:
#     a=int(input("guess the correct num:"))
    
#     if a==ran:
#         print("Correct")
#         break
#     elif a>ran:
#         print("too high")
#     elif a<ran:
#         print("too low")
#     else:
#         print("Try again")


attempt=5
ran=88
while attempt > 0:
    print("total attempts =",attempt)
    
    a=int(input("guess the number:"))
    if attempt == 0:
        print("lose")
        break
    elif a==ran:
        print("win")
        break
    else:
        attempt -=1
        print("try again")
    