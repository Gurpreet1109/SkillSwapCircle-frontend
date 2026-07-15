import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { reviewService } from "../../services/reviewService";
import { exchangeService } from "../../services/exchangeService";
import ReviewCard from "../../components/cards/ReviewCard";
import Modal from "../../components/common/Modal";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";

const Reviews = () => {
  const { user } = useAuth();

  const [reviews, setReviews] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({
    exchangeRequest: "",
    reviewee: "",
    rating: 5,
    comment: "",
    didKnowSubject: true,
    explainedClearly: true,
  });
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    const userId = user?._id;

    // Prevent /api/reviews/user/undefined
    if (!userId) {
      setReviews([]);
      setCompleted([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    const loadReviewsPage = async () => {
      try {
        const [reviewResponse, exchangeResponse] = await Promise.all([
          reviewService.getUserReviews(userId).catch(() => ({ reviews: [] })),
          exchangeService.getMy().catch(() => ({ requests: [] })),
        ]);

        if (cancelled) return;

        setReviews(reviewResponse?.reviews || []);

        const requests = Array.isArray(exchangeResponse)
          ? exchangeResponse
          : exchangeResponse?.requests || [];

        setCompleted(
          requests.filter((request) => request.status === "completed")
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadReviewsPage();

    return () => {
      cancelled = true;
    };
  }, [user?._id]);

  const closeModal = () => {
    setModal(false);
    setForm({
      exchangeRequest: "",
      reviewee: "",
      rating: 5,
      comment: "",
      didKnowSubject: true,
      explainedClearly: true,
    });
  };

  const submit = async () => {
    const userId = user?._id;

    if (!userId) {
      setToast("Please wait for your account to load.");
      return;
    }

    if (!form.exchangeRequest || !form.reviewee) {
      setToast("Please select a completed exchange.");
      return;
    }

    setSending(true);

    try {
      await reviewService.create(form);

      const reviewResponse = await reviewService
        .getUserReviews(userId)
        .catch(() => ({ reviews: [] }));

      setReviews(reviewResponse?.reviews || []);
      setToast("Review submitted! ✓");
      closeModal();
    } catch (error) {
      setToast(error?.message || "Could not submit the review.");
    } finally {
      setSending(false);
      setTimeout(() => setToast(""), 3000);
    }
  };

  const selectExchange = (request) => {
    if (!request || !user?._id) return;

    const userId = String(user._id);
    const senderId = String(request.sender?._id || request.sender || "");
    const receiverId = request.reciever?._id || request.reciever || "";

    const reviewee = senderId === userId
      ? receiverId
      : request.sender?._id || request.sender;

    setForm((current) => ({
      ...current,
      exchangeRequest: request._id,
      reviewee,
    }));
  };

  return (
    <div className="content-area">
      {toast && (
        <div
          style={{
            position: "fixed",
            top: 80,
            right: 20,
            zIndex: 2000,
            background: "var(--bg-card2)",
            border: "1px solid var(--border)",
            borderRadius: 10,
            padding: "0.75rem 1rem",
            color: "var(--text)",
            fontSize: "0.875rem",
          }}
        >
          {toast}
        </div>
      )}

      <div
        className="animate-fade-up"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <p className="section-label">Feedback</p>
          <h2
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800,
              marginBottom: 0,
            }}
          >
            Reviews
          </h2>
        </div>

        {completed.length > 0 && (
          <Button variant="primary" onClick={() => setModal(true)}>
            + Write Review
          </Button>
        )}
      </div>

      {loading ? (
        <Loader />
      ) : reviews.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "4rem 2rem",
            color: "var(--text-muted)",
          }}
        >
          <p style={{ fontSize: "2rem" }}>★</p>
          <p>No reviews received yet. Complete exchanges to get reviewed.</p>
        </div>
      ) : (
        <div className="row g-3 animate-fade-up">
          {reviews.map((review) => (
            <div key={review._id} className="col-md-6 col-lg-4">
              <ReviewCard review={review} />
            </div>
          ))}
        </div>
      )}

      <Modal
        show={modal}
        onClose={closeModal}
        title="Write a Review"
        footer={
          <div
            style={{
              display: "flex",
              gap: 10,
              justifyContent: "flex-end",
            }}
          >
            <Button variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button
              variant="primary"
              loading={sending}
              onClick={submit}
              disabled={!form.exchangeRequest || !form.reviewee}
            >
              Submit
            </Button>
          </div>
        }
      >
        <div style={{ marginBottom: "1rem" }}>
          <label
            style={{
              display: "block",
              marginBottom: 6,
              fontSize: "0.85rem",
              color: "var(--text-muted)",
            }}
          >
            Select completed exchange
          </label>

          <select
            className="input-dark"
            value={form.exchangeRequest}
            onChange={(event) =>
              selectExchange(
                completed.find(
                  (request) => request._id === event.target.value
                )
              )
            }
          >
            <option value="">Choose exchange…</option>

            {completed.map((request) => (
              <option key={request._id} value={request._id}>
                Exchange #{request._id.slice(-6)} –{" "}
                {request.senderSkill?.title || "?"} ↔{" "}
                {request.recieverSkill?.title || "?"}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label
            style={{
              display: "block",
              marginBottom: 8,
              fontSize: "0.85rem",
              color: "var(--text-muted)",
            }}
          >
            Rating
          </label>

          <div style={{ display: "flex", gap: 8 }}>
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                type="button"
                onClick={() =>
                  setForm((current) => ({ ...current, rating }))
                }
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "1.5rem",
                  color:
                    rating <= form.rating ? "#fbbf24" : "var(--text-dim)",
                }}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <Input
          label="Comment"
          as="textarea"
          rows={3}
          value={form.comment}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              comment: event.target.value,
            }))
          }
          placeholder="Share your experience…"
        />

        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          {[
            { key: "didKnowSubject", label: "Knew the subject well?" },
            { key: "explainedClearly", label: "Explained clearly?" },
          ].map(({ key, label }) => (
            <label
              key={key}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                cursor: "pointer",
                fontSize: "0.85rem",
                color: "var(--text-muted)",
              }}
            >
              <input
                type="checkbox"
                checked={form[key]}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    [key]: event.target.checked,
                  }))
                }
              />
              {label}
            </label>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default Reviews;         