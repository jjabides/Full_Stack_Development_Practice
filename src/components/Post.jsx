import PropTypes from 'prop-types'
import { User } from './User.jsx'

export function Post({ title, contents, author, fullPost = false }) {
    return (
        <article>
            <h3>{title}</h3>
            {fullPost && <div>{contents}</div>}
            {author && (
                <em>
                    {fullPost && <br />}
                    Written by <User id={author}></User>
                </em>
            )}
        </article>
    )
}

Post.propTypes = {
    title: PropTypes.string.isRequired,
    contents: PropTypes.string,
    author: PropTypes.string,
    fullPost: PropTypes.bool,
}
