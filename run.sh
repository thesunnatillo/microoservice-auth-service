#!/bin/bash

echo "Qaysi komandani ishlatishni xohlaysiz?"
echo "1) npm run build"
echo "2) npm run start:dev"


read -p "Tanlang [1 yoki 2]: " choice


if [ "$choice" -eq 1 ]; then
  echo "Birinchi komandani ishga tushiryapman..."
  npm run build
elif [ "$choice" -eq 2 ]; then
  echo "Ikkinchi komandani ishga tushiryapman..."
  npm run start:dev
else
  echo "Noto'g'ri tanlov! Iltimos, 1 yoki 2 ni tanlang."
fi
