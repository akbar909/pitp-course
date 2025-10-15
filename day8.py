
friend_count = int(input("Enter the number of friends you have: "))
friends_list = []
while friend_count > 0:
    friendNames = input("Enter you Friends Name = ").lower()
    if friendNames in friends_list:
        print("Friend Already Exists in List")
        AskNew = input("Do you want to add another Friend ? YES or NO = "). lower()
        if AskNew == "no":
            break
        else:
            continue
    else:
        friends_list.append(friendNames)
        print("Friend Added")
        friend_count -= 1
        if friend_count == 0:
            wantSearch = input("Do you want to search Friend ? YES/NO ").lower()
            if wantSearch == "no":
                break
            else:
                enterName = input("Enter Name to Search : ").lower()
                at = friends_list.index(enterName)
                print(f"Friend Found at Index {at}")
friends_list.sort()
t = tuple(friends_list)
print(f"Friends list = {t}")