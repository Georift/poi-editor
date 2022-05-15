export const IDMapMarker = ({
  iconId,
  changed,
}: {
  iconId?: string;
  changed: boolean;
}) => {
  return (
    <svg
      style={{
        height: 25,
        width: 19,
      }}
    >
      <g transform="translate(9, 24)">
        {/* Adds a little circle on the ground under the marker, I don't think we need this for anything */}
        {/*<ellipse cx="0.5" cy="1" rx="6.5" ry="3" className="stroke"></ellipse>*/}
        <path
          className="stroke"
          transform="translate(-8, -23)"
          d="M 17,8 C 17,13 11,21 8.5,23.5 C 6,21 0,13 0,8 C 0,4 4,-0.5 8.5,-0.5 C 13,-0.5 17,4 17,8 z"
        ></path>
        {iconId && (
          <use
            transform="translate(-5, -19)"
            className="icon"
            width="11px"
            height="11px"
            xlinkHref={`#${iconId}`}
          ></use>
        )}
        {/* TODO: style this modified icon better */}
        {changed && (
          <g>
            <circle
              r="6"
              fill="red"
              transform="translate(4, -4)"
              opacity={0.5}
            ></circle>
            <text fill="white" fontSize={9} fontWeight="bold">
              M
            </text>
          </g>
        )}
      </g>
    </svg>
  );
};

IDMapMarker.defaultProps = {
  changed: false,
};
