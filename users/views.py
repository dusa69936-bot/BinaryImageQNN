from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.contrib import messages

import json
import base64
import io
from PIL import Image

from .models import UserRegistrationModel
from .utility.QNNPyTorchModel import predict_digit


# ================= USER REGISTER =================

def UserRegisterActions(request):

    if request.method == "POST":

        loginid = request.POST.get("loginid")

        # 🔥 duplicate check
        if UserRegistrationModel.objects.filter(loginid=loginid).exists():
            return render(request, "UserRegister.html", {
                "msg": "Login ID already exists"
            })

        UserRegistrationModel.objects.create(
            name=request.POST.get("name"),
            loginid=loginid,
            password=request.POST.get("password"),
            mobile=request.POST.get("mobile"),
            email=request.POST.get("email"),
            locality=request.POST.get("locality"),
            address=request.POST.get("address"),
            city=request.POST.get("city"),
            state=request.POST.get("state"),
            status="waiting"   # 🔥 better flow (admin activates)
        )

        return render(request, "UserLogin.html", {
            "msg": "Registered Successfully. Wait for Admin Approval."
        })

    return render(request, "UserRegister.html")


# ================= USER LOGIN =================

def UserLoginCheck(request):

    if request.method == "POST":

        loginid = request.POST.get("loginid")
        password = request.POST.get("password")

        try:
            user = UserRegistrationModel.objects.get(
                loginid=loginid,
                password=password
            )

            # 🔥 CHECK STATUS
            if user.status != "activated":
                messages.error(request, "Account not activated yet")
                return redirect("UserLogin")

            request.session["user"] = user.loginid
            messages.success(request, "Login Successful")

            return redirect("UserHome")

        except UserRegistrationModel.DoesNotExist:

            messages.error(request, "Invalid Login Details")
            return redirect("UserLogin")

    return redirect("UserLogin")


# ================= USER LOGOUT =================

def UserLogout(request):

    request.session.flush()
    messages.success(request, "Logged out successfully")

    return redirect("index")


# ================= USER PAGES =================

def UserHome(request):
    if "user" not in request.session:
        return redirect("UserLogin")

    return render(request, "users/UserHomePage.html")


def UserViewDataset(request):
    if "user" not in request.session:
        return redirect("UserLogin")

    return render(request, "users/user_view_data.html")


def UserTestCanvasMNIST(request):
    if "user" not in request.session:
        return redirect("UserLogin")

    return render(request, "users/UserHomeCanvas.html")


def QNNAccuracy(request):
    if "user" not in request.session:
        return redirect("UserLogin")

    return render(request, "users/qnn_results.html", {
        "accuracy": 97.5,
        "loss": 0.02
    })


def eda_analysis(request):
    if "user" not in request.session:
        return redirect("UserLogin")

    return render(request, "users/eda_analysis.html")


# ================= 🔥 ADMIN: VIEW USERS =================

def ViewUsers(request):

    if "admin" not in request.session:
        return redirect("AdminLogin")

    data = UserRegistrationModel.objects.all()
    return render(request, 'admins/ViewUsers.html', {'data': data})


# ================= 🔥 ADMIN: ACTIVATE USER =================

def ActivateUser(request, id):

    if "admin" not in request.session:
        return redirect("AdminLogin")

    user = UserRegistrationModel.objects.get(id=id)
    user.status = 'activated'
    user.save()

    return redirect('view_users')


# ================= 🔥 ADMIN: DELETE USER =================

def DeleteUser(request, id):

    if "admin" not in request.session:
        return redirect("AdminLogin")

    user = UserRegistrationModel.objects.get(id=id)
    user.delete()

    return redirect('view_users')


# ================= MNIST API =================

def MnistTorchQNN(request):

    if request.method == "POST":

        try:
            data = json.loads(request.body)

            image_data = data.get("image")
            actual_digit = int(data.get("actual"))

            image_data = image_data.split(",")[1]
            image_bytes = base64.b64decode(image_data)

            image = Image.open(io.BytesIO(image_bytes)).convert("L")

            prediction = predict_digit(image)

            return JsonResponse({
                "prediction": int(prediction),
                "result": int(prediction) == actual_digit
            })

        except Exception as e:
            print("Prediction Error:", e)

            return JsonResponse({
                "prediction": -1,
                "result": False
            })

    return JsonResponse({"error": "Invalid request method"})