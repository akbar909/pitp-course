# num = int( input("Enter a number: ") )

# if num % 2 == 0:
#     print(f"{num} is an even number")
# else:
#     print(f"{num} is an odd number")


# num = int( input("Enter a number: ") )
# if num % 3 == 0 and num % 5 == 0:
#     print("DINGDONG")
# elif num % 3 == 0:
#     print("DING")
# elif num % 5 == 0:
#     print("DONG")
# else:
#     print("DONGDING")



# num = input("Enter a number/ num in text: ").lower()
# if num == "one" or num == "1":
#     num = 1
# elif num == "two" or num == "2":
#     num = 2
# elif num == "three" or num == "3":
#     num = 3
# elif num == "four" or num == "4":
#     num = 4
# elif num == "five" or num == "5":
#     num = 5
# elif num == "six" or num == "6":
#     num = 6
# elif num == "seven" or num == "7":
#     num = 7
# elif num == "eight" or num == "8":
#     num = 8
# elif num == "nine" or num == "9":
#     num = 9
# elif num == "ten" or num == "10":
#     num = 10
# num = int(num)
# if num%3 == 0 and num%5 == 0:
#     print("DINGDONG")
# elif num%3 == 0:
#     print("DING")
# elif num%5 == 0:
#     print("DONG")
# else:
#     print("DONGDING")

# Task 1
# a = int(input("Enter first number: "))
# b = int(input("Enter second number: "))
# if a > b:
#     print(f"{a} is greater than {b}")
# elif a < b:
#     print(f"{b} is greater than {a}")
# Task 2
# elif a == b:
#     print(f"{a} is equal to {b}") 

# Task 3
# a = int(input("Enter first number: "))
# b = int(input("Enter second number: "))
# if a != b:
#     print(f"{a} is not equal to {b}")
# elif a == b:
#     print(f"{a} is equal to {b}")

# a = int(input("Enter first number: "))
# b = int(input("Enter second number: "))
# if a <= b:
#     print(f"{a} is less than or equal to {b}")
# elif a > b:
#     print(f"{a} is greater than {b}")

# a = int(input("Enter first number: "))
# b = int(input("Enter second number: "))
# sum = a + b
# if sum > 15:
#     print(f"The sum of {a} and {b} is greater than 15")
# elif sum == 15:
#     print(f"The sum of {a} and {b} is equal to 15")
# else:
#     print(f"The sum of {a} and {b} is less than 15")
    
obtMarks = int(input("Enter the marks obtained: "))
totalMarks = int(input("Enter the total marks: "))
percentage = (obtMarks / totalMarks) * 100

if percentage >= 90:
    print(f"Grade A+ ,  percentage: {percentage}%")
elif percentage >= 80:
    print(f"Grade A , percentage: {percentage}%")
elif percentage >= 70:
    print(f"Grade B , percentage: {percentage}%")
elif percentage >= 60:
    print(f"Grade C , percentage: {percentage}%")
elif percentage >= 50:
    print(f"Grade D , percentage: {percentage}%")
elif percentage >= 40:
    print(f"Grade E , percentage: {percentage}%")
else:
    print(f"Grade F , percentage: {percentage}%")