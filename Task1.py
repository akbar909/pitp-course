# Task 1: Simple equation x + y^x
def eq1(x, y):
    print(x + y**x)

# Task 2: Equation with fraction and multiplication
def eq2(x):
    print(2 - (35*x/x) + 11*x)

# Task 3: Complex fraction equation
def eq3(x, y):
    print((11*x - 41*y**2)/(x*y))

# Task 4: Power equation with subtraction
def eq4(g):
    print((g - g**2)**g)

# Task 5: Complex root equation
def eq5(x, y):
    print((x*(y-22*x)/y**2)**(1/3))

# Task 6: Program to compare two numbers
def compare_numbers():
    num1 = float(input("Enter first number: "))
    num2 = float(input("Enter second number: "))
    if num1 != num2:
        print("Numbers are not equal")
    else:
        print("Numbers are equal")

# Task 7: Check if age is under 18
def check_age():
    age = int(input("Enter your age: "))
    if age < 18:
        print("You are under 18")
    else:
        print("You are 18 or older")

# Task 8: Compare two strings
def compare_strings():
    str1 = "Hello"
    str2 = "World"
    if str1 == str2:
        print("Strings are equal")
    else:
        print("Strings are not equal")

# Task 9: Compare eq4 and eq5 outputs
def compare_equations(g, x, y):
    result_eq4 = eq4(g)
    result_eq5 = eq5(x, y)
    if result_eq4 > result_eq5:
        print("eq4 output is greater than eq5")
    else:
        print("eq4 output is not greater than eq5")

# Task 10: Check email length
def check_email_length():
    email = input("Enter your email: ")
    if len(email) > 14:
        print("Email length is greater than 14")
    else:
        print("Email length is not greater than 14")

# Task 11: Check email length and .com presence
def validate_email():
    email = input("Enter your email: ")
    if len(email) > 14 and ".com" in email:
        print("Email is valid")
    else:
        print("Email is invalid")

# Task 12: Check eq4 result properties
def check_eq4_result(g):
    result = eq4(g)
    if result > 0 and result % 2 == 0:
        print("Result is positive and multiple of 2")
    else:
        print("Result does not meet criteria")

# Task 13: Check home address properties
def check_address():
    address = input("Enter your home address: ")
    city_name = input("Enter your city name: ")
    if city_name in address and len(city_name) > 0:
        print("Address contains city name and city name length is valid")
    else:
        print("Address or city name is invalid")

eq1(1,3)
eq2(5)
eq3(10,2)
eq4(4)
eq5(6,12)
compare_numbers()
check_age()
compare_strings()
check_email_length()
validate_email()
check_address()
