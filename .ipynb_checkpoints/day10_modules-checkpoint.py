import math
import statistics
while True:
    print("Scientific Calculator")
    print("1. Square Root\n2. Power\n3. Factorial\n4. Mean\n5. Median\n6. Mode\n7. Trigonometric Functions\n8. Arthemetic Operations\n9. Exit")
    choice = int(input("Enter your choice (1-9): "))
    if choice == 1:
        num = float(input("Enter a number: "))
        print("Square Root of", num, "is", math.sqrt(num))
    elif choice == 2:
        base = float(input("Enter base: "))
        exp = float(input("Enter exponent: "))
        print(base, "raised to the power of", exp, "is", math.pow(base, exp))
    elif choice == 3:
        num = int(input("Enter a number: "))
        print("Factorial of", num, "is", math.factorial(num))
    elif choice == 4:
        total_numbers = int(input("Enter total numbers: "))
        numbers = []
        while len(numbers) < total_numbers:
            num = float(input("Enter number: "))
            numbers.append(num)
        print("Mean of the numbers is", statistics.mean(numbers))
    elif choice == 5:
        total_numbers = int(input("Enter total numbers: "))
        numbers = []
        while len(numbers) < total_numbers:
            num = float(input("Enter number: "))
            numbers.append(num)
            print("Numbers are", numbers)
        print("Median of the numbers is", statistics.median(numbers))
    elif choice == 6:
        total_numbers = int(input("Enter total numbers: "))
        numbers = []
        while len(numbers) < total_numbers:
            num = float(input("Enter number: "))
            numbers.append(num)
            print("Numbers are", numbers)
        print("Mode of the numbers is", statistics.mode(numbers))
    elif choice == 7:
        print("1. Sin \n2. Cos \n3. Tan")
        func_choice = int(input("Enter your choice (1-3): "))
        angle = float(input("Enter angle in degrees: "))
        radians = math.radians(angle)
        if func_choice == 1:
            print("Sin(", angle, ") =", math.sin(radians))
        elif func_choice == 2:
            print("Cos(", angle, ") =", math.cos(radians))
        elif func_choice == 3:
            print("Tan(", angle, ") =", math.tan(radians))
        else:
            print("Invalid function choice")
    elif choice == 8:
        print("1. Addition \n2. Subtraction \n3. Multiplication \n4. Division")
        op_choice = int(input("Enter your choice (1-4): "))
        num1 = float(input("Enter first number: "))
        num2 = float(input("Enter second number: "))
        if op_choice == 1:
            print(num1, "+", num2, "=", num1 + num2)
        elif op_choice == 2:
            print(num1, "-", num2, "=", num1 - num2)
        elif op_choice == 3:
            print(num1, "*", num2, "=", num1 * num2)
        elif op_choice == 4:
            if num2 != 0:
                print(num1, "/", num2, "=", num1 / num2)
            else:
                print("Error: Division by zero")
        else:
            print("Invalid operation choice")
    elif choice == 9:
        print("Exiting the calculator. Goodbye!")
        break
    else:
        print("Invalid choice")
    cont = input("Do you want to perform another calculation? (yes/no): ").lower()
    if cont != 'yes':
        break