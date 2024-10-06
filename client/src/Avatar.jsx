import PropTypes from "prop-types";

function Avatar({ username, id }) {
  const colors = [
    "bg-red-200",
    "bg-teal-200",
    "bg-yellow-200",
    "bg-blue-200",
    "bg-green-200",
    "bg-pink-200",
  ];
  const colorIndex = parseInt(id, 16) % colors.length;
  const avatarColor = colors[colorIndex];

  return (
    <div
      className={
        "w-8 h-8 bg-red-200 rounded-full flex items-center " + avatarColor
      }
    >
      <div className="text-center w-full font-bold">{username[0]}</div>
    </div>
  );
}

Avatar.propTypes = {
  username: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};

export default Avatar;
