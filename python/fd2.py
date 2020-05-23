import face_recognition

srk = face_recognition.load_image_file('./img/srk1.jpeg')
srk_en = face_recognition.face_encodings(srk)[0]

unknown_img = face_recognition.load_image_file('./img/srk3.jpeg')
u_i_en = face_recognition.face_encodings(unknown_img)

if len(u_i_en):
  print(u_i_en)
  results = face_recognition.compare_faces(
    [srk_en], u_i_en[0]
  )
  if results[0]:
    print('This is a match')
  else:
    print('This is not a match')
else:
  print('Cannot match image')


