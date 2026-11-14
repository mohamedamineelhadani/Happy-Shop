import { useRef, useState } from "react";
import { uploadService } from "../../services";
import { useToast } from "../../context/ToastContext";
import { Image as ImageIcon, Trash, Upload } from "../../lib/icons";
import Loading from "./Loading";

const MAX_BYTES = 5 * 1024 * 1024;
const ACCEPT = "image/png,image/jpeg,image/webp,image/gif";

/**
 * Product image picker: drag & drop or browse, uploads to the API and reports
 * the resulting URL back through `onChange`.
 */
export default function ImageUploader({ value, onChange, label = "Product image" }) {
  const toast = useToast();
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [busy, setBusy] = useState(false);

  async function handleFile(file) {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose a JPG, PNG, WEBP or GIF image.", "Unsupported file");
      return;
    }
    if (file.size > MAX_BYTES) {
      toast.error("The image must be smaller than 5 MB.", "File too large");
      return;
    }

    setBusy(true);
    setProgress(0);
    try {
      const response = await uploadService.image(file, setProgress);
      onChange(response.data.url);
      toast.success("Image uploaded.", "Uploaded");
    } catch (error) {
      toast.error(error.message, "Upload failed");
    } finally {
      setBusy(false);
      setProgress(0);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function onDrop(event) {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files?.[0];
    handleFile(file);
  }

  return (
    <div className="uploader">
      <span className="field__label">{label}</span>

      <div className="uploader__grid">
        <div className="uploader__preview">
          {value ? (
            <img src={value} alt="Product preview" />
          ) : (
            <span className="uploader__placeholder">
              <ImageIcon size={28} />
              <small>No image</small>
            </span>
          )}
        </div>

        <div
          className={`uploader__drop${dragging ? " is-dragging" : ""}`}
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
        >
          {busy ? (
            <Loading label={`Uploading… ${progress}%`} />
          ) : (
            <>
              <Upload size={22} />
              <p>
                Drag &amp; drop an image here, or{" "}
                <button
                  type="button"
                  className="link"
                  onClick={() => inputRef.current?.click()}
                >
                  browse
                </button>
              </p>
              <small className="dim">JPG, PNG, WEBP or GIF · up to 5 MB</small>
            </>
          )}

          <input
            ref={inputRef}
            type="file"
            accept={ACCEPT}
            hidden
            onChange={(event) => handleFile(event.target.files?.[0])}
          />
        </div>
      </div>

      <div className="uploader__url">
        <input
          type="text"
          className="input"
          placeholder="/images/products/example.jpg or https://…"
          value={value || ""}
          onChange={(event) => onChange(event.target.value)}
        />
        {value ? (
          <button
            type="button"
            className="icon-btn icon-btn--danger"
            onClick={() => onChange("")}
            aria-label="Remove image"
            title="Remove image"
          >
            <Trash size={17} />
          </button>
        ) : null}
      </div>
    </div>
  );
}
