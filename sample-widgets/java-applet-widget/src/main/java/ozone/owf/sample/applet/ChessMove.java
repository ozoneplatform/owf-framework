package ozone.owf.sample.applet;
//---------------------------------------------------------------------------
// Chessmove.java
//
// This is the java souce file for the ChessMove object which encaspulates
// a chess move with it's assocated position and possible comment.
//
// Author - Michael Keating
//---------------------------------------------------------------------------


class ChessMove
{
    private int     _nSource, _nDest;
    private String  _strMove;
    private char    _position[];
    private char    _promotionChar;
    private boolean _bIsEnPassent;
    private String  _strComment;

    /**
     *    Constructor for ChessMove - simply initalizes the class data
     */

    public ChessMove(int nSource, int nDest, String strMove, char position[], char promotionChar)
    {
        _nSource       = nSource;
        _nDest         = nDest;
        _strMove       = strMove;
        _position      = position;
        _promotionChar = promotionChar;
        _bIsEnPassent  = false;
        _strComment    = "";
    }

    public int getSourceSquare()
    {
        return _nSource;
    }

    public int getDestSquare()
    {
        return _nDest;
    }

    public String getMove()
    {
        return _strMove;
    }

    public char[] getPosition()
    {
        return (char [])_position.clone();
    }

    public char getPromotionChar()
    {
        return _promotionChar;
    }

    public boolean isEnPassent()
    {
        return _bIsEnPassent;
    }

    public void setEnPassent()
    {
        _bIsEnPassent = true;
    }

    public void setComment(String strComment)
    {
        _strComment = strComment;
    }

    public String getComment()
    {
        return _strComment;
    }

    public void setMoveString(String strMove)
    {
        _strMove = strMove;
    }

    public String getLongAlg()
    {
        String strLongAlgMove = "";

        if (_position[_nSource] != 'P' && _position[_nSource] != 'p' && _position[_nSource] != '-')
        {
            strLongAlgMove += Character.toUpperCase(_position[_nSource]);
        }

        // get the source square

        int file = _nSource % 8;
        int rank = Math.abs(_nSource - 63) / 8;

        strLongAlgMove += (char)('a' + file);
        strLongAlgMove += (char)('1' + rank);

        strLongAlgMove += '-';

        // get the dest square

        file = _nDest % 8;
        rank = Math.abs(_nDest - 63) / 8;

        strLongAlgMove += (char)('a' + file);
        strLongAlgMove += (char)('1' + rank);

        if (_promotionChar != '\0')
        {
            strLongAlgMove += "=" + _promotionChar;
        }

        return strLongAlgMove;
    }

    public String getBasicAlg()
    {
        // build a simple move string like "e2e4", "g1f3", etc.

        String strBasicAlgMove = "";

        // get the source square

        int file = _nSource % 8;
        int rank = Math.abs(_nSource - 63) / 8;

        strBasicAlgMove += (char)('a' + file);
        strBasicAlgMove += (char)('1' + rank);

        // get the dest square

        file = _nDest % 8;
        rank = Math.abs(_nDest - 63) / 8;

        strBasicAlgMove += (char)('a' + file);
        strBasicAlgMove += (char)('1' + rank);

        if (_promotionChar != '\0')
        {
            strBasicAlgMove += _promotionChar;
        }

        return strBasicAlgMove;
    }
}

