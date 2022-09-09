const d = document,
    $main = d.querySelector("main"),
    $file = d.getElementById("files");



    const uploader = (file) => {
      const xhr = new XMLHttpRequest(),
        formData = new FormData();

        formData.append("file", file);

        xhr.addEventListener("readystatechange", e => {
          if(xhr.readyState !== 4) return;
          if (xhr.status >= 200 && xhr.satus < 300) {
            let json = JSON.parse(xhr.responseText);
          } else {
            let message = xhr.statusText || "Ocurrió un error";
            console.error(`Error ${xhr.status}: ${message}`);
          }
        });
        xhr.open("POST",  "uploader.php");
        xhr.setRequestHeader("enc-type", "multipart/form-data");
        xhr.send(formData);
    }


    const progressUpload = (file) => {
      const $progress = d.createElement("progress"),
      $span = d.createElement("span");

      $progress.classList.add("progress-bar");
      $span.classList.add("file-name");

      $progress.value = 0;
      $progress.max = 100;

      $main.insertAdjacentElement("beforeend", $progress);
      $main.insertAdjacentElement("beforeend", $span);

      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.addEventListener("progress", e  => {
        let progress = parseInt((e.loaded * 100) / e.total);
        $progress.value = progress;
        $span.innerHTML = `<b>${file.name} - ${progress}%</b>`;
      });

      fileReader.addEventListener("loadend", e  => {
        uploader(file);
        setTimeout(() => {
          $main.removeChild($progress);
          $main.removeChild($span);
          $file.value="";
        },  3000);
      });
    }

    d.addEventListener("change", e => {
      if(e.target === $file) {
        const files = Array.from(e.target.files);
        files.forEach(el => progressUpload(el));
      }
    });

    const $dropZone = d.querySelector(".drop-zone"),
      $title = d.querySelector(".drop-zone-title");

    $dropZone.addEventListener("dragover",  e => {
      e.preventDefault();
      e.stopPropagation();
      $title.classList.add("show");
      e.target.classList.add("is-active");
    });
    $dropZone.addEventListener("dragleave",  e => {
      e.preventDefault();
      e.stopPropagation();
      $title.classList.remove("show");
      e.target.classList.remove("is-active");
    });
    $dropZone.addEventListener("drop",  e => {
      e.preventDefault();
      e.stopPropagation();
      const files = Array.from(e.dataTransfer.files);
      files.forEach(el => progressUpload(el));
      $title.classList.remove("show");
      e.target.classList.remove("is-active");
    });