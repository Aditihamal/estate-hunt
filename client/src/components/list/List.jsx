import "./list.scss";
import Card from "../card/Card";

function List({ posts, onDelete, onSave, onEdit }) {
  return (
    <div className="list">
      {posts.map((item) => (
        <Card
          key={item.id}
          item={item}
          onDelete={onDelete}
          onSave={onSave}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}

export default List;
