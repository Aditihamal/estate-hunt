function PostForm({ post, onChange, onSubmit, loading }) {
    return (
      <form onSubmit={onSubmit}>
        <label>
          Title:
          <input
            type="text"
            value={post.title}
            onChange={(e) => onChange({ ...post, title: e.target.value })}
          />
        </label>
        <label>
          Price:
          <input
            type="number"
            value={post.price}
            onChange={(e) => onChange({ ...post, price: e.target.value })}
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    );
  }
  export default PostForm;
  