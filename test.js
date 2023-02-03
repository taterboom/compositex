fetch(
  "https://api.zeplin.io/v2/projects/61d4190b61e1e510d0f8a09f/screens/63ac115f9bad2590e4b76931/versions",
  {
    headers: {
      "zeplin-token":
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdHYiOjIsImp0aSI6IjYyMTMwZDQ0YzNhNzU0MTI2ODliZTZkMyIsImVtYWlsVmVyaWZpZWQiOnRydWUsImlhdCI6MTY0NTQxNTc0OCwiYXVkIjoiYXV0aGVudGljYXRpb24iLCJpc3MiOiJ6ZXBsaW46YXBpLnplcGxpbi5pbyIsInN1YiI6IjVmNGRlYmQ4ZGVjZTk2YjA1ZTA1OTc3NyJ9.J5Pe4J2vq5bfZZXT5P9uou97XVb4_GAPQIXAbziMyQY",
    },
  }
)
  .then((res) => res.json())
  .then(console.log)
