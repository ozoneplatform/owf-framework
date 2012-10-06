package ozone.owf.sample.applet;
//--------------------------------------------------------------------------------------
// ChessScoreKeeper.java
//
// This file contains the java source to keep the history of a chess game and
// to find legal moves.
//
// Author - Michael Keating
//--------------------------------------------------------------------------------------

import java.util.Hashtable;
import java.util.StringTokenizer;
import java.util.Vector;

class ChessScoreKeeper
{
    final char newGamePosition[] = {'r','n','b','q','k','b','n','r',
                                    'p','p','p','p','p','p','p','p',
                                    '-','-','-','-','-','-','-','-',
                                    '-','-','-','-','-','-','-','-',
                                    '-','-','-','-','-','-','-','-',
                                    '-','-','-','-','-','-','-','-',
                                    'P','P','P','P','P','P','P','P',
                                    'R','N','B','Q','K','B','N','R'};

    private char    lastPosition[];
    private char    currentPosition[];
    private int     intCurrentMoveIndex;
    private int     intTotalMoves;
    private int     intRAVDepth;
    private boolean bIsWhitesMove;
	private boolean bBlackHadFirstMove;
	private boolean isGameOver;
	private boolean bWhiteCanKCastle;
	private boolean bWhiteCanQCastle;
	private boolean bBlackCanKCastle;
	private boolean bBlackCanQCastle;
	private Vector  vCurrentMoveKeys;
    private Hashtable hshChessMoves;

    public ChessScoreKeeper()
    {
        currentPosition     = (char [])newGamePosition.clone();
        lastPosition        = (char [])currentPosition.clone();
        intTotalMoves       = 0;
        intCurrentMoveIndex = 0;
        intRAVDepth         = 0;
        bIsWhitesMove       = true;
		bBlackHadFirstMove  = false;
        isGameOver          = false;
		bWhiteCanKCastle    = true;
		bWhiteCanQCastle    = true;
		bBlackCanKCastle    = true;
		bBlackCanQCastle    = true;
        hshChessMoves       = new Hashtable();
        vCurrentMoveKeys    = new Vector();
    }

    public int setFEN(String strFEN)
    {
        // parse strFEN with StringTokenizer

        StringTokenizer st = new StringTokenizer(strFEN, " ");

        // a FEN string always has six fields

        if (st.countTokens() != 6)
        {
            return -1;
        }

        for (int i = 0; st.hasMoreTokens(); ++i)
        {
			String strToken = st.nextToken();
			switch (i)
            {
                case 0:

                    // our position

                    if (setFENPosition(strToken) == -1)
                    {
                        return -1;
                    }

                    break;

                case 1:

                    // the player on move

                    bIsWhitesMove = strToken.equals("w");
					bBlackHadFirstMove = !bIsWhitesMove;
                    break;

				case 2:

					// castling availability

					bWhiteCanKCastle = strToken.indexOf('K') != -1;
					bWhiteCanQCastle = strToken.indexOf('Q') != -1;
					bBlackCanKCastle = strToken.indexOf('k') != -1;
					bBlackCanQCastle = strToken.indexOf('q') != -1;
					
					break;

				case 5:

					// the starting move number

//					intCurrentMoveIndex = Integer.parseInt(st.nextToken());
//					break;

				default:

                    //st.nextToken();
                    break;
            }
        }

        return 0;
    }

    private int setFENPosition(String strFENPosition)
    {
        // start with an empty board

        char position[] = {'-','-','-','-','-','-','-','-',
                           '-','-','-','-','-','-','-','-',
                           '-','-','-','-','-','-','-','-',
                           '-','-','-','-','-','-','-','-',
                           '-','-','-','-','-','-','-','-',
                           '-','-','-','-','-','-','-','-',
                           '-','-','-','-','-','-','-','-',
                           '-','-','-','-','-','-','-','-'};

        // example FEN position: 2r1nr1k/pp1q1p1p/3bpp2/5P2/1P1Q4/P3P3/1B3P1P/R3K1R1

        int intSquare = 0;
        for (int i = 0; i < strFENPosition.length(); ++i)
        {
            // intSquare should never be greater than 63

            if (intSquare > 63)
            {
                return -1;
            }

            char ch = strFENPosition.charAt(i);
            if (Character.isDigit(ch))
            {
                intSquare += Character.digit(ch, 10);
                continue;
            }
            else if (Character.isLetter(ch))
            {
                position[intSquare] = ch;
                ++intSquare;
                continue;
            }
            else
            {
                continue;
            }
        }

        // intSquare should always be 64 here

        if (intSquare == 64)
        {
            currentPosition = (char [])position.clone();
            return 0;
        }

        return -1;
    }

    public char[] getCurrentPosition()
    {
        return (char[])currentPosition.clone();
    }

    public int getCurrentMoveIndex()
    {
        return intCurrentMoveIndex;
    }

    public String getMoveKey(int intIndex)
    {
        return (String)vCurrentMoveKeys.elementAt(intIndex);
    }

    public int getTotalMoves()
    {
        return intTotalMoves;
    }

    public boolean isWhitesMove()
    {
        return bIsWhitesMove;
    }

	public boolean blackHadFirstMove()
	{
		return bBlackHadFirstMove;
	}

	public String getPGNMoveAt(int intIndex)
    {
        if (intIndex > intTotalMoves)
        {
            return "error";
        }

        ChessMove cm = getChessMoveAt(intIndex);

        return cm.getMove();
    }

    public ChessMove getCurrentChessMove()
    {
        return getChessMoveAt(intCurrentMoveIndex);
    }

    public ChessMove getChessMoveAt(int intIndex)
    {
        // the first element in a chess address vector is the main line index - go get it.

        String strKey = "";
        try
        {
            strKey = (String)vCurrentMoveKeys.elementAt(intIndex);
        }
        catch (Exception e)
        {
            return null;
        }

        return (ChessMove)hshChessMoves.get(strKey);
    }

    // isVariationAt returns true if the current move is the beginning
    // of variation

    public boolean isVariationAt(int intIndex)
    {
        boolean bIsVariation = false;

        if (intIndex >= intTotalMoves)
        {
            return false;
        }

        String strKey = (String)vCurrentMoveKeys.elementAt(intIndex);

        if (strKey.endsWith(",0"))
        {
            bIsVariation = true;
        }

        return bIsVariation;
    }

    // variationsAt returns the number of variations at the given move index

    public int variationsAt(int intIndex)
    {
        if (intIndex >= intTotalMoves)
        {
            return 0;
        }

        String strKey = (String)vCurrentMoveKeys.elementAt(intIndex);
        if (strKey.endsWith(",0"))
        {
            // if this is a active variation point - get it's main line key
            // by removing the 0,0

            strKey = strKey.substring(0, strKey.lastIndexOf(','));
            strKey = strKey.substring(0, strKey.lastIndexOf(','));
        }

        int i;
        for (i = 0;;++i)
        {
            if (!hshChessMoves.containsKey(strKey + "," + i + ",0"))
            {
                break;
            }
        }

        return i;
    }

    public boolean isMainLineVariationAt(int intIndex)
    {
        if (!isVariationAt(intIndex))
        {
            return false;
        }

        String strKey = (String)vCurrentMoveKeys.elementAt(intIndex);

        strKey = strKey.substring(0, strKey.lastIndexOf(','));
        strKey = strKey.substring(0, strKey.lastIndexOf(','));

        if (strKey.indexOf(',') == -1)
        {
            return true;
        }

        return false;
    }

    public Vector getVariationsAt(int intIndex)
    {
        if (variationsAt(intIndex) == 0)
        {
            return null;
        }

        Vector vRAVS = new Vector();

        // the second to last number in the key is the variation index - go find 'em
        // for example: 5,0,0  5,1,0  5,2,0  are all variations on move five

        String strKey = (String)vCurrentMoveKeys.elementAt(intIndex);

        // first add the main line

        String strMainLineKey;
        if (strKey.endsWith(",0"))
        {
            strMainLineKey = strKey.substring(0, strKey.lastIndexOf(','));
            strMainLineKey = strMainLineKey.substring(0, strMainLineKey.lastIndexOf(','));
        }
        else
        {
            // this is the main line.  Just add it.

            strMainLineKey = strKey;
        }

        if (hshChessMoves.containsKey(strMainLineKey))
        {
            ChessMove cm = (ChessMove)hshChessMoves.get(strMainLineKey);
            vRAVS.addElement(cm.getMove());
        }

        // add the varations

        for (int i = 0;; ++i)
        {
            String strVariationKey;
            if (strKey.endsWith(",0"))
            {
                strVariationKey = strKey.substring(0, strKey.lastIndexOf(','));
                strVariationKey = strVariationKey.substring(0, strVariationKey.lastIndexOf(','));
                strVariationKey = strVariationKey + "," + i + ",0";
            }
            else
            {
                // this is the main line.  Just add ',X,0'

                strVariationKey = strKey + "," + i + ",0";
            }

            if (hshChessMoves.containsKey(strVariationKey))
            {
                ChessMove cm = (ChessMove)hshChessMoves.get(strVariationKey);
                vRAVS.addElement(cm.getMove());
            }
            else
            {
                // no more variations

                break;
            }
        }

        return vRAVS;
    }

    public void setLine(int intRAVIndex)
    {
        // set the current variation (RAV) to the given RAV index at the current move index

        int intCurMoveIndex = getCurrentMoveIndex();
        if (variationsAt(intCurMoveIndex) == 0)
        {
            return;
        }

        // find the selected line

        String strKey = (String)vCurrentMoveKeys.elementAt(intCurMoveIndex);
        String strNewLineKey = "";

        if (intRAVIndex == 0)
        {
            // set this variation to the main line

            if (strKey.endsWith(",0"))
            {
                strNewLineKey = strKey.substring(0, strKey.lastIndexOf(','));
                strNewLineKey = strNewLineKey.substring(0, strNewLineKey.lastIndexOf(','));
            }
            else
            {
                // this is already the main line.

                return;
            }
        }
        else
        {
            if (strKey.endsWith(",0"))
            {
                strNewLineKey = strKey.substring(0, strKey.lastIndexOf(','));
                strNewLineKey = strNewLineKey.substring(0, strNewLineKey.lastIndexOf(','));
            }
            else
            {
                strNewLineKey = strKey;
            }

            strNewLineKey = strNewLineKey + "," + (intRAVIndex - 1) + ",0";
        }

        if (!hshChessMoves.containsKey(strNewLineKey))
        {
            // error - return

            return;
        }

        // now that we have our new line key - set the new current game keys
        // Set the new line at the give index to the new key

        vCurrentMoveKeys.setElementAt(strNewLineKey ,intCurMoveIndex);

        // remove the old line by making intIndex the last move

        vCurrentMoveKeys.setSize(intCurMoveIndex + 1);

        // now add the remaining keys in the line
        // get the current move index in this variation
        // i.e. - in 5,0,3 the '3' is the move index

        boolean bFirstMainLine;
        String strIndex;
        if (strNewLineKey.indexOf(',') == -1)
        {
            strIndex       = strNewLineKey;
            bFirstMainLine = true;
        }
        else
        {
            strIndex       = strNewLineKey.substring(strNewLineKey.lastIndexOf(',') + 1, strNewLineKey.length());
            bFirstMainLine = false;
        }

        int intMoveIndex = Integer.parseInt(strIndex);

        for (;;)
        {
            ++intMoveIndex;
            if (bFirstMainLine)
            {
                strKey = "";
            }
            else
            {
                strKey = strNewLineKey.substring(0, strNewLineKey.lastIndexOf(',') + 1);
            }

            strKey += intMoveIndex;

            if (hshChessMoves.containsKey(strKey))
            {
                vCurrentMoveKeys.addElement(strKey);
            }
            else
            {
                // no more moves

                intTotalMoves = vCurrentMoveKeys.size();
                break;
            }
        }
    }

    public void setLine(int intIndex, String strKey, boolean bWhitesMove)
    {
        // Set the new line at the give index to the new key

        vCurrentMoveKeys.setElementAt(strKey ,intIndex - 1);

        // remove the old line by making intIndex the last move

        vCurrentMoveKeys.setSize(intIndex);

        // goto the new line.

        gotoPosition(intIndex - 1);

        // set the correct player on move

        bIsWhitesMove = bWhitesMove;

        // The position will be 1/2 move less than where we want
        // it to be - so we'll use the current chess move to adjust it

        //int intSource = getCurrentChessMove().getSourceSquare();
        //int intDest   = getCurrentChessMove().getDestSquare();

        ChessMove cm = getCurrentChessMove();

        moveThePiece(cm.getSourceSquare(),
                     cm.getDestSquare(),
                     currentPosition,
                     cm.getPromotionChar(),
                     cm.isEnPassent());

        //currentPosition[intDest] = currentPosition[intSource];
        //currentPosition[intSource] = '-';

        intTotalMoves       = intIndex;
        intCurrentMoveIndex = intIndex;

        --intRAVDepth;
    }

    public void gotoPosition(int intIndex)
    {
        if (intIndex <= intTotalMoves)
        {
            intCurrentMoveIndex = intIndex;

            if (intIndex == intTotalMoves)
            {
                // the move vector is always one less that total moves
                // so there is no "currentChessMove" here.  So, use
                // lastPosition instead.

                currentPosition = (char [])lastPosition.clone();
            }
            else
            {
                currentPosition = getCurrentChessMove().getPosition();
            }
        }
    }

    public boolean makeMove(String pgnMove)
    {
        return makeMove(pgnMove, false);
    }

    public boolean makeMove(String pgnMove, boolean bNewLine)
    {
        int     dest;
        char    piece;
        char    rankChar      = '\0';
        char    fileChar      = '\0';
        char    promotionChar = '\0';
        String  destString;

        // these booleans are used to help construct a short
        // algebraic move from a long one.

        boolean bIsLongPgn  = false;
        boolean bIsCaptured = false;
        boolean bIsCheck    = false;
        boolean bIsMate     = false;

        // this must be the latest move

        if (!bNewLine && intCurrentMoveIndex != intTotalMoves || isGameOver)
        {
            return false;
        }

        // if this is a new RAV line, we need to go back a move and
        // remove the last move played from vCurrentMoveKeys

        if (bNewLine)
        {
            if (intCurrentMoveIndex < 1 || vCurrentMoveKeys.size() < 1)
            {
                return false;
            }

            --intCurrentMoveIndex;
            currentPosition = getCurrentChessMove().getPosition();
            vCurrentMoveKeys.removeElementAt(vCurrentMoveKeys.size() - 1);
            bIsWhitesMove = !bIsWhitesMove;

            ++intRAVDepth;
        }

        // use workMove so that pngMove never get's changed

        String workMove = pgnMove;
        String strAnnotation = "";

        // if there is a 'check' symbol(+), or the 'mate'
        // symbol (#), remove it from the workMove.

        if (workMove.endsWith("+"))
        {
            bIsCheck = true;
            workMove = workMove.substring(0, workMove.length() - 1);
        }
        else if (workMove.endsWith("#"))
        {
            bIsMate = true;
            workMove = workMove.substring(0, workMove.length() - 1);
        }
		else if (workMove.endsWith("+!!") ||
			workMove.endsWith("+!?") ||
			workMove.endsWith("+??") ||
			workMove.endsWith("+?!"))
		{
			strAnnotation = workMove.substring(workMove.length() - 3, workMove.length());
			workMove = workMove.substring(0, workMove.length() - 3);
		}		
		else if (workMove.endsWith("!!") ||
		  	     workMove.endsWith("!?") ||
			     workMove.endsWith("??") ||
			     workMove.endsWith("?!") ||
			     workMove.endsWith("+!") ||
			     workMove.endsWith("+?"))
		{
			strAnnotation = workMove.substring(workMove.length() - 2, workMove.length());
			workMove = workMove.substring(0, workMove.length() - 2);
		}
		else if (workMove.endsWith("!") ||
                 workMove.endsWith("?"))
        {
            strAnnotation = workMove.substring(workMove.length() - 1, workMove.length());
            workMove = workMove.substring(0, workMove.length() - 1);
        }

        // are we promoting a pawn? Get the promotion piece and
        // remove it from the workMove

        //if (workMove.length() > 1 && workMove.charAt(workMove.length() - 2) == '=')
        char cLastChar = workMove.charAt(workMove.length() - 1);
        if (workMove.length() > 1 && Character.isLetter(cLastChar) && cLastChar != 'O' && cLastChar != 'o')
        {
            promotionChar = workMove.charAt(workMove.length() - 1);
            if (workMove.charAt(workMove.length() - 2) == '=')
            {
                 workMove = workMove.substring(0, workMove.length() - 2);
            }
            else
            {
                workMove = workMove.substring(0, workMove.length() - 1);
            }
        }

        // determine the piece type (pawn, rook, etc) to
        // move, and determine the destination square in
        // algebraic notaion (e4, f6, etc)

        // castling?

        if (workMove.equals("O-O") || workMove.equals("0-0") || workMove.equals("o-o"))
        {
            if (bIsWhitesMove)
            {
                piece      = 'K';
                destString = "g1";
            }
            else
            {
                piece      = 'k';
                destString = "g8";
            }
        }
        else if (workMove.equals("O-O-O") || workMove.equals("0-0-0") || workMove.equals("o-o-o"))
        {
            if (bIsWhitesMove)
            {
                piece      = 'K';
                destString = "c1";
            }
            else
            {
                piece      = 'k';
                destString = "c8";
            }
        }

        // is this a win, loss, or draw - game over dude

        else if (workMove.equals("1-0") || workMove.equals("0-1") || workMove.equals("1/2-1/2") || workMove.equals("*"))
        {
            if (workMove.equals("*"))
            {
                // "..." looks better on the scoresheet than "*"

                workMove = "...";
            }

            ChessMove chessMove = new ChessMove(0, 0, workMove, (char[])currentPosition.clone(), promotionChar);

            addMove(chessMove);

            if (intRAVDepth == 0)
            {
                isGameOver = true;
            }

            return true;
        }

        else if (workMove.length() == 2)
        {
            // this is a pawn move such as e4, d6, etc.

            piece      = 'P';
            destString = workMove;
        }
        else if (workMove.length() == 3)
        {
            // moves like Nf3, Bg5 or pawn captures like ed4

            if (Character.isLowerCase(workMove.charAt(0)))
            {
                // a move like ed5 - a capturing pawn move

                piece = 'P';
                fileChar = workMove.charAt(0);
            }
            else
            {
                // a move like Nf3

                piece = workMove.charAt(0);
            }

            destString = workMove.substring(1, 3);
        }
        else if (workMove.length() == 4)
        {
            // moves like Bxe5, exd4, Ngd2

            destString = workMove.substring(2, 4);

            if (workMove.charAt(1) != 'x')
            {
                // this is a move like Nge2 or R8f7

                piece = workMove.charAt(0);

                if (Character.isDigit(workMove.charAt(1)))
                {
                    rankChar = workMove.charAt(1);
                }
                else
                {
                    fileChar = workMove.charAt(1);
                }
            }
            else
            {
                if (Character.isLowerCase(workMove.charAt(0)))
                {
                    // a move like exd5 - a capturing pawn move

                    piece = 'P';
                    fileChar = workMove.charAt(0);
                }
                else
                {
                    // a move like Nxd5

                    piece = workMove.charAt(0);
                }
            }
        }
        else if (workMove.length() == 5)
        {
           // first, look for LONG algebraic moves - e2-e4, c5xd4

            if (Character.isLowerCase(workMove.charAt(0)) &&
               (workMove.charAt(2) == '-' || workMove.charAt(2) == 'x'))
            {
                piece      = 'P';
                destString = workMove.substring(3, 5);
                fileChar   = workMove.charAt(0);
                rankChar   = workMove.charAt(1);

                if (workMove.charAt(2) == 'x')
                {
                    bIsCaptured = true;
                }

                bIsLongPgn = true;
            }
            else
            {
                // next, SHORT algebraic moves like Raxd2

                piece      = workMove.charAt(0);
                destString = workMove.substring(3, 5);

                if (Character.isDigit(workMove.charAt(1)))
                {
                    rankChar = workMove.charAt(1);
                }
                else
                {
                    fileChar = workMove.charAt(1);
                }
            }
        }
        else if (workMove.length() == 6)
        {
            // moves like Ng1-f3, or Qb6xb2

            piece      = workMove.charAt(0);
            destString = workMove.substring(4, 6);

            fileChar = workMove.charAt(1);
            rankChar = workMove.charAt(2);

            if (workMove.charAt(3) == 'x')
            {
                bIsCaptured = true;
            }

            bIsLongPgn = true;
        }
        else
        {
            return false;
        }

        // first convert the destString to 'int dest'

        int file = (int)(destString.charAt(0) - 'a');
        int rank = (int)(destString.charAt(1) - '0');

        // the pgn rank is the reverse to our ChessBoard rank
        // so let's reverse it to our system here.

        rank = (rank - 8) * -1;

        // now calculate our dest square

        dest = (rank * 8) + file;

        // the key here is to find the source square - given the piece and the
        // destination square, a legal move check of the whole board will give
        // us the source square

        for (int i = 0; i < 64; ++i)
        {
            // if we're given a rankOrFile (as in Nge2, N3e2), make sure
            // we're on that rank or file

            if (rankChar != '\0')
            {
                if (fileChar != '\0')
                {
                    // both rank and file are given - caculate
                    // the source square

                    int sourceRank = Character.digit(rankChar, 10);

                    // convert the rank to our 'chessboard' rank

                    sourceRank = Math.abs(sourceRank - 8);

                    int sourceFile = (int)(fileChar - 'a');

                    int sourceSquare = sourceRank * 8 + sourceFile;

                    if (i != sourceSquare)
                    {
                        continue;
                    }
                }

                // no file was given - find the piece on the give rank

                else
                {
                    int sourceRank = Character.digit(rankChar, 10);
                    int thisRank   = i / 8;

                    // our ChessBoard rank needs to be revered

                    thisRank = (thisRank - 8) * -1;

                    // now just make sure we're on the given rank

                    if (thisRank != sourceRank)
                    {
                        continue;
                    }
                }
            }
            else if (fileChar != '\0')
            {
                 if ((fileChar == 'a') && (!is_a_File(i)))
                 {
                     continue;
                 }
                 else if ((fileChar == 'b') && (!is_b_File(i)))
                 {
                     continue;
                 }
                 else if ((fileChar == 'c') && (!is_c_File(i)))
                 {
                     continue;
                 }
                 else if ((fileChar == 'd') && (!is_d_File(i)))
                 {
                     continue;
                 }
                 else if ((fileChar == 'e') && (!is_e_File(i)))
                 {
                     continue;
                 }
                 else if ((fileChar == 'f') && (!is_f_File(i)))
                 {
                     continue;
                 }
                 else if ((fileChar == 'g') && (!is_g_File(i)))
                 {
                     continue;
                 }
                 else if ((fileChar == 'h') && (!is_h_File(i)))
                 {
                     continue;
                 }
            }

            // if it's black's move make piece lower case

            piece = bIsWhitesMove ? piece : Character.toLowerCase(piece);

            if (piece == currentPosition[i])
            {
                ChessMove m = new ChessMove(i,
                                            dest,
                                            pgnMove,
                                            (char[])currentPosition.clone(),
                                            promotionChar);

                if (isLegal(m, bIsWhitesMove))
                {
                    // set bIsCaptured if necessary

                    if (currentPosition[dest] != '-' || m.isEnPassent())
                    {
                        bIsCaptured = true;
                    }

                    // now make the actual move

                    moveThePiece(m.getSourceSquare(),
                                 m.getDestSquare(),
                                 currentPosition,
                                 m.getPromotionChar(),
                                 m.isEnPassent());

                    // get a short version of the move (if necessary) to
                    // make the score sheet more pleasant to the eye.

                    String strMove = "";

                    if (bIsLongPgn)
                    {
                        if (bIsCaptured)
                        {
                            strMove += pgnMove.substring(0, 1) + 'x';
                        }
                        else if (piece != 'P' && piece != 'p')
                        {
                           strMove += pgnMove.substring(0, 1);
                        }

                        strMove += destString;

                        if (Character.isLetter(promotionChar))
                        {
                            strMove += "=" + promotionChar;
                        }

                        // casting?

                        if (piece == 'K' || piece == 'k')
                        {
                            if ((i == 60 && dest == 62) || (i == 4 && dest == 6))
                            {
                                strMove = "O-O";
                            }
                            else if ((i == 60 && dest == 58) || (i == 4 && dest == 2))
                            {
                                strMove = "O-O-O";
                            }
                        }

                        if (isWhiteInCheck(currentPosition) || isBlackInCheck(currentPosition))
                        {
                            bIsCheck = true;
                        }

                        if (bIsCheck)
                        {
                            strMove += "+";
                        }

                        if (bIsMate)
                        {
                            strMove += "#";
                        }

                        if (!strAnnotation.equals(""))
                        {
                            // strAnnotation could be "!", "??", etc.

                            strMove += strAnnotation;
                        }
                    }
                    else
                    {
                        strMove = pgnMove;
                    }

                    // now set our pretty short algebraic PGN style move

                    m.setMoveString(strMove);

                    // add the move to the hashtable

                    addMove(m);

                    return true;
                }
            }
        }

        // add "err" to the move for our PGN applet

        ChessMove m = new ChessMove(0,
                                    0,
                                    pgnMove + "-err",
                                    (char[])currentPosition.clone(),
                                    '\0');
        addMove(m);
        return false;
    }

    private void addMove(ChessMove cm)
    {
        lastPosition = (char[])currentPosition.clone();

        // add the move to the hashtable
        // first we need to figure out what our key is.  If we are
        // equal to Total moves, we are not a RAV (variation)

        String strCurrentKey = "";
        String strNewKey = "";

        if (intCurrentMoveIndex != 0)
        {
            strCurrentKey = (String)vCurrentMoveKeys.elementAt(intCurrentMoveIndex - 1);
        }

        // adding a new move in the current line.
        // simply find this line's index and add one to it.

        if (intCurrentMoveIndex == 0)
        {
            strNewKey = "0";
        }
        else if (strCurrentKey.lastIndexOf(',') == -1)
        {
            // this is the main line

            try
            {
                strNewKey = Integer.toString(Integer.parseInt(strCurrentKey) + 1);
            }
            catch (Exception e)
            {
                return;
            }
        }
        else
        {
             // get the move index in this variation - it's the last token

             String strIndex = strCurrentKey.substring(strCurrentKey.lastIndexOf(',') + 1, strCurrentKey.length());
             int intNewIndex = Integer.parseInt(strIndex) + 1;
             strNewKey = strCurrentKey.substring(0, strCurrentKey.lastIndexOf(',')) + "," + intNewIndex;
        }

        if (intTotalMoves > intCurrentMoveIndex)
        {
            // this is a new variation - add it after any other variations on this move
            // so, "5" with no other variations will be "5,0,0"
            // "5" with an existing "5,0,0" will be "5,1,0" and so on.

            String strFirstKey = strNewKey;
            for (int i = 0;;++i)
            {
                strNewKey = strFirstKey + "," + i + ",0";
                if (!hshChessMoves.containsKey(strNewKey))
                {
                    break;
                }
            }
        }

        // now add that chess move

        hshChessMoves.put(strNewKey, cm);
        vCurrentMoveKeys.addElement(strNewKey);

        bIsWhitesMove = !bIsWhitesMove;

        ++intCurrentMoveIndex;
        intTotalMoves = intCurrentMoveIndex;
    }

    /**
     *   IsLegal determines if the move from sourceSquare to destquare
     *   is a legal chess move given the current game's state.
     */

    public boolean isLegal(ChessMove m)
    {
        return isLegal(m, bIsWhitesMove);
    }

    boolean isLegal(ChessMove m, boolean bWhitesMove)
    {
        char position[] = m.getPosition();
        char piece      = position[m.getSourceSquare()];

        if((bWhitesMove && Character.isLowerCase(piece)) ||
          (!bWhitesMove && Character.isUpperCase(piece)))
        {
            // hey! wait your turn

            return false;
        }

        // make sure we're not capturing a friendly piece

        if ((bWhitesMove && Character.isUpperCase(position[m.getDestSquare()])) ||
           (!bWhitesMove && Character.isLowerCase(position[m.getDestSquare()])))
        {
            return false;
        }

        switch (piece)
        {
            case 'p':
            case 'P':

                if (!isPawnMove(m))
                {
                    return false;
                }

                break;

            case 'n':
            case 'N':

                if (!isKnightMove(m))
                {
                    return false;
                }

                break;

            case 'b':
            case 'B':

                if (!isBishopMove(m))
                {
                    return false;
                }

                break;

            case 'r':
            case 'R':

                if (!isRookMove(m))
                {
                    return false;
                }

                break;

            case 'q':
            case 'Q':

                if (!isQueenMove(m))
                {
                    return false;
                }

                break;

            case 'k':
            case 'K':

                if (!isKingMove(m))
                {
                    return false;
                }

                break;

            default:

                return false;
        }

        // now move the piece and see if we're left in check

        char tempPosition[] = (char[])m.getPosition().clone();
        moveThePiece(m.getSourceSquare(),
                     m.getDestSquare(),
                     tempPosition,
                     '\0',
                     m.isEnPassent());

        if (bWhitesMove && isWhiteInCheck(tempPosition))
        {
            return false;
        }

        if (!bWhitesMove && isBlackInCheck(tempPosition))
        {
            return false;
        }

		// set castling flags if needed
		// Hack alert: only looking at the castling flags on the main line for now
		// We should really keep a stack and adjust in castling flags for whatever
        // variation we are on.
		if (intRAVDepth == 0)
		{
			if (m.getSourceSquare() == 60 || m.getSourceSquare() == 63)
			{
				bWhiteCanKCastle = false;
			}
			else if (m.getSourceSquare() == 60 || m.getSourceSquare() == 56)
			{
				bWhiteCanQCastle = false;
			}
			if (m.getSourceSquare() == 4 || m.getSourceSquare() == 7)
			{
				bBlackCanKCastle = false;
			}
			else if (m.getSourceSquare() == 4 || m.getSourceSquare() == 0)
			{
				bBlackCanQCastle = false;
			}
		}

        return true;
    }

    boolean isPawnMove(ChessMove m)
    {
        char position[] = m.getPosition();

        final char piece    = position[m.getSourceSquare()];
        final int  distance = m.getSourceSquare() - m.getDestSquare();

        // black pawns

        if (piece == 'p')
        {
            // are we moving two squares?

            if (distance == -16)
            {
                // not on the second rank

                if (m.getSourceSquare() > 15)
                {
                    return false;
                }

                // is there an enemy piece blocking us?

                else if (position[m.getDestSquare() - 8] != '-' ||
                         position[m.getDestSquare()]     != '-')
                {
                    return false;
                }
                else
                {
                    return true;
                }
            }

            // are we moving one square?

            else if (distance == - 8)
            {
                // we can't capture a piece in front of us

                if (position[m.getDestSquare()] != '-')
                {
                    return false;
                }
                else
                {
                    return true;
                }
            }

            // is this pawn capturing a piece?

            else if (distance == -7 || distance == -9)
            {
                // don't jump over the edge of the board

                if (is_a_File(m.getSourceSquare()) && is_h_File(m.getDestSquare()))
                {
                    return false;
                }

                if (is_h_File(m.getSourceSquare()) && is_a_File(m.getDestSquare()))
                {
                    return false;
                }

                // check for En Passent here
                // First, we must be on the sixth rank to be an e.p. move

                if (m.getDestSquare() / 8 == 5)
                {
                    // we must examine the last move to determine if this is
                    // en passent

                    ChessMove lastMove = getChessMoveAt(intCurrentMoveIndex - 1);

                    if ((lastMove.getDestSquare()   == (m.getDestSquare() - 8)) &&
                        (lastMove.getSourceSquare() == (m.getDestSquare() + 8)))
                    {
                        m.setEnPassent();
                        return true;
                    }
                }

                // make sure we're capturing an enemy piece

                if (!Character.isUpperCase(position[m.getDestSquare()]))
                {
                    return false;
                }

                return true;
            }

            // if we made it here we're illegal dude

            return false;
        }

        // white pawns

        else if (piece == 'P')
        {
            // are we moving two squares?

            if (distance == 16)
            {
                // not on the second rank

                if (m.getSourceSquare() < 48)
                {
                    return false;
                }

                // is there an enemy piece blocking us?

                else if (position[m.getDestSquare() + 8] != '-' ||
                         position[m.getDestSquare()]     != '-')
                {
                    return false;
                }
                else
                {
                    return true;
                }
            }

            // are we moving one square?

            else if (distance == 8)
            {
                // we can't capture a piece in front of us

                if (position[m.getDestSquare()] != '-' )
                {
                    return false;
                }
                else
                {
                    return true;
                }
            }

            // is this pawn capturing a piece?

            else if (distance == 7 || distance == 9)
            {

                // don't jump over the edge of the board

                if (is_a_File(m.getSourceSquare()) && is_h_File(m.getDestSquare()))
                {
                    return false;
                }

                if (is_h_File(m.getSourceSquare()) && is_a_File(m.getDestSquare()))
                {
                    return false;
                }

                // check for En Passent here
                // First, we must be on the sixth rank to be an e.p. move

                if (m.getDestSquare() / 8 == 2)
                {
                    // we must examine the last move to determine if this is
                    // en passent

                    ChessMove lastMove = getChessMoveAt(intCurrentMoveIndex - 1);

                    if ((lastMove.getDestSquare()   == (m.getDestSquare() + 8)) &&
                        (lastMove.getSourceSquare() == (m.getDestSquare() - 8)))
                    {
                        m.setEnPassent();
                        return true;
                    }
                }

                // make sure we're capturing an enemy piece

                if (!Character.isLowerCase(position[m.getDestSquare()]))
                {
                    return false;
                }

                return true;
            }

            // if we made it here we're illegal dude

            return false;
        }
        else
        {
            // hey, we're supposed to be moving a pawn dude!

            return false;
        }
    }

    boolean isKnightMove(ChessMove m)
    {
        // Do not let the knight jump over the side of board

        if ((is_a_File(m.getSourceSquare()) || is_b_File(m.getSourceSquare())) &&
            (is_g_File(m.getDestSquare())   || is_h_File(m.getDestSquare())))
        {
            return false;
        }

        if ((is_a_File(m.getDestSquare())   || is_b_File(m.getDestSquare())) &&
            (is_g_File(m.getSourceSquare()) || is_h_File(m.getSourceSquare())))
        {
            return false;
        }

        // okay, now look for a valid knight move

        final int distance = m.getSourceSquare() - m.getDestSquare();

        if (distance ==  17 || distance == -17 ||
            distance ==  10 || distance == -10 ||
            distance ==  15 || distance == -15 ||
            distance ==   6 || distance ==  -6)
        {
            return true;
        }

        return false;
    }

    boolean isBishopMove(ChessMove m)
    {
        char position[] = m.getPosition();

        int distance = Math.abs(m.getSourceSquare() - m.getDestSquare());

        // must be moved diagonally

        if ((distance % 7 != 0) && (distance % 9 != 0))
        {
            return false;
        }

        // bishops cannot move to opposite color squares

        if (isLightSquare(m.getSourceSquare()) && isDarkSquare(m.getDestSquare()))
        {
            return false;
        }
        if (isDarkSquare(m.getDestSquare()) && isLightSquare(m.getDestSquare()))
        {
            return false;
        }

        // now make sure there are no pieces blocking us and
        // that we don't jump off the board

        // first, the right top to left bottom diagonal

        if (distance % 7 == 0 && distance != 63)
        {
            // are we moving from top to bottom?

            if (m.getDestSquare() > m.getSourceSquare())
            {
                for (int i = m.getSourceSquare() + 7; i < m.getDestSquare(); i += 7)
                {
                    // is a piece in our way?

                    if (position[i] != '-')
                    {
                        return false;
                    }

                    // don't move beyond the bottom or left
                    // edge of the board

                    if (isBoardTop(i) || is_h_File(i))
                    {
                        return false;
                    }
                }
                if (isBoardTop(m.getDestSquare()) || is_h_File(m.getDestSquare()))
                {
                    return false;
                }
            }

            // are we moving from bottom to top?

            else if (m.getDestSquare() < m.getSourceSquare())
            {
                for (int i = m.getSourceSquare() - 7; i > m.getDestSquare(); i -= 7)
                {
                    // is a piece in our way?

                    if (position[i] != '-')
                    {
                        return false;
                    }

                    // don't move beyond the top or right
                    // edge of the board

                    if (isBoardBottom(i) || is_a_File(i))
                    {
                        return false;
                    }
                }

                // don't land beyond the bottom or top
                // edge of the board

                if (isBoardBottom(m.getDestSquare()) || is_a_File(m.getDestSquare()))
                {
                    return false;
                }
            }
        }

        // left top to right bottom diagonal below

        else if (distance % 9 == 0)
        {
            // are we moving from top to bottom?

            if (m.getDestSquare() > m.getSourceSquare())
            {
                for (int i = m.getSourceSquare() + 9; i < m.getDestSquare(); i += 9)
                {
                    // is a piece in our way?

                    if (position[i] != '-')
                    {
                        return false;
                    }

                    // don't move beyond the bottom or left
                    // edge of the board

                    if (isBoardTop(i) || is_a_File(i))
                    {
                        return false;
                    }
                }

                // don't land on the right or top edge of the board

                if (isBoardTop(m.getDestSquare()) || is_a_File(m.getDestSquare()))
                {
                    return false;
                }
            }

            // are we moving from bottom to top?

            else if (m.getDestSquare() < m.getSourceSquare())
            {
                for (int i = m.getSourceSquare() - 9; i > m.getDestSquare(); i -= 9)
                {
                    // is a piece in our way?

                    if (position[i] != '-')
                    {
                        return false;
                    }

                    // don't move beyond the top or right
                    // edge of the board

                    if (isBoardBottom(i) || is_h_File(i))
                    {
                        return false;
                    }
                }

                // don't land beyond the bottom or top edge of the board

                if (isBoardBottom(m.getDestSquare()) || is_h_File(m.getDestSquare()))
                {
                    return false;
                }
            }
        }

        return true;
    }

    boolean isRookMove(ChessMove m)
    {
        char position[] = m.getPosition();

        boolean isXMove  = false;
        boolean isYMove  = false;

        // horizonal (x-move) or verticle (y-move)

        if ((m.getSourceSquare() / 8) == (m.getDestSquare() / 8))
        {
            isXMove = true;
        }
        else if ((m.getSourceSquare() - m.getDestSquare()) % 8 == 0)
        {
            isYMove = true;
        }
        else
        {
            return false;
        }

        // now make sure there are no pieces blocking us and
        // that we don't jump off the board

        // first, handle the verticle moves

        if (isYMove)
        {
            // are we moving from top to bottom?

            if (m.getDestSquare() > m.getSourceSquare())
            {
                for (int i = m.getSourceSquare() + 8; i < m.getDestSquare(); i += 8)
                {
                    // is a piece in our way?

                    if (position[i] != '-')
                    {
                        return false;
                    }
                }
            }

            // are we moving from bottom to top?

            else if (m.getDestSquare() < m.getSourceSquare())
            {
                for (int i = m.getSourceSquare() - 8; i > m.getDestSquare(); i -= 8)
                {
                    // is a piece in our way?

                    if (position[i] != '-')
                    {
                        return false;
                    }
                }
            }
        }

        // left top to right bottom diagonal below

        else if (isXMove)
        {
            // are we moving from left to right?

            if (m.getDestSquare() > m.getSourceSquare())
            {
                for (int i = m.getSourceSquare() + 1; i < m.getDestSquare(); ++i)
                {
                    // is a piece in our way?

                    if (position[i] != '-')
                    {
                        return false;
                    }

                    // don't move beyond the right edge of the board

                    if (is_a_File(i))
                    {
                        return false;
                    }
                }

                // don't land on the left edge of the board

                if (is_a_File(m.getDestSquare()))
                {
                    return false;
                }
            }

            // are we moving from right to left?

            else if (m.getDestSquare() < m.getSourceSquare())
            {
                for (int i = m.getSourceSquare() - 1; i > m.getDestSquare(); i--)
                {
                    // is a piece in our way?

                    if (position[i] != '-')
                    {
                        return false;
                    }

                    // don't move beyone the left edge of the board

                    if (is_h_File(i))
                    {
                        return false;
                    }
                }

                // don't land on the right edge of the board

                if (is_h_File(m.getDestSquare()))
                {
                    return false;
                }
            }
        }

        return true;
    }

    boolean isQueenMove(ChessMove m)
    {
        return isRookMove(m) || isBishopMove(m);
    }

    boolean isKingMove(ChessMove m)
    {
        // check for castling moves

		if (m.getSourceSquare() == 60 && m.getDestSquare() == 62 && bWhiteCanKCastle)
        {
            // a white king-side castle

            return true;
        }
        else if (m.getSourceSquare() == 60 && m.getDestSquare() == 58 && bWhiteCanQCastle)
        {
            // a white queen-side castle

            return true;
        }
        else if (m.getSourceSquare() ==  4 && m.getDestSquare() == 6 && bBlackCanKCastle)
        {
            // a black king-side castle

            return true;
        }
        else if (m.getSourceSquare() ==  4 && m.getDestSquare() == 2 && bBlackCanQCastle)
        {
            // a black queen-side castle

            return true;
        }
        else
        {
            // don't jump over the edge of the board

            if ((is_a_File(m.getSourceSquare()) && is_h_File(m.getDestSquare())) ||
                (is_h_File(m.getSourceSquare()) && is_a_File(m.getDestSquare())))
            {
                return false;
            }

            // now look for valid king moves

            final int distance = Math.abs(m.getSourceSquare() - m.getDestSquare());
            if  (distance ==  1 || distance == 7 || distance ==  8 || distance == 9)
            {
                return true;
            }
        }

        return false;
    }

    private boolean isSquareAttacked(int attackedSquare, char position[], boolean byWhite)
    {
        ChessMove chessMove;

        for (int i = 0; i < 64; ++i)
        {
            // is a white piece attacking this square?

            if (byWhite)
            {
                if (Character.isUpperCase(position[i]))
                {
                    chessMove = new ChessMove(i, attackedSquare, "", position, '\0');
                    if (isLegal(chessMove, true))
                    {
                        return true;
                    }
                }
            }
            else
            {
                // is a black piece attacking this square?

                if (Character.isLowerCase(position[i]))
                {
                    chessMove = new ChessMove(i, attackedSquare, "", position, '\0');
                    if (isLegal(chessMove, false))
                    {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    public boolean isWhiteInCheck(char position[])
    {
        // find white's king square and see if it is attacked

        for(int i = 0; i < 64; ++i)
        {
            if (position[i] == 'K')
            {
                return isSquareAttacked(i, position, false);
            }
        }

        return false;
    }

    public boolean isBlackInCheck(char position[])
    {
        // find black's king square and see if it is attacked

        for(int i = 0; i < 64; ++i)
        {
            if (position[i] == 'k')
            {
                return isSquareAttacked(i, position, true);
            }
        }

        return false;
    }

    public boolean isLightSquare(int square)
    {
        int file = (square + 8) % 8;
        int rank =  square / 8;

        return (file + rank) % 2 == 0;
    }

    public boolean isDarkSquare(int square)
    {
        int file = (square + 8) % 8;
        int rank =  square / 8;

        return (file + rank) % 2 != 0;
    }

    public boolean isBoardTop(int square)
    {
        return square < 8;
    }

    public boolean isBoardBottom(int square)
    {
        return square > 55;
    }

    boolean is_a_File(int square)
    {
        return (square + 8) % 8 == 0;
    }

    boolean is_b_File(int square)
    {
        return (square + 8) % 8 == 1;
    }

    boolean is_c_File(int square)
    {
        return (square + 8) % 8 == 2;
    }

    boolean is_d_File(int square)
    {
        return (square + 8) % 8 == 3;
    }

    boolean is_e_File(int square)
    {
        return (square + 8) % 8 == 4;
    }

    boolean is_f_File(int square)
    {
        return (square + 8) % 8 == 5;
    }

    boolean is_g_File(int square)
    {
        return (square + 8) % 8 == 6;
    }

    boolean is_h_File(int square)
    {
        return (square + 8) % 8 == 7;
    }

    /**
     *   moveThePiece simply makes the given move in the given position
     */

    private void moveThePiece(int source, int dest, char position[], char promotionChar, boolean bIsEP)
    {
        // castling move?

        if (position[source] == 'K' || position[source] == 'k')
        {
            if (source == 60 && dest == 62)
            {
                // a white king-side castle

                position[60] = '-';
                position[62] = 'K';
                position[63] = '-';
                position[61] = 'R';
                return;
            }
            else if (source == 60 && dest == 58)
            {
                // a white queen-side castle

                position[60] = '-';
                position[58] = 'K';
                position[56] = '-';
                position[59] = 'R';
                return;
            }
            else if (source ==  4 && dest == 6)
            {
                // a black king-side castle

                position[4] = '-';
                position[6] = 'k';
                position[7] = '-';
                position[5] = 'r';
                return;
            }
            else if (source ==  4 && dest == 2)
            {
                // a black queen-side castle

                position[4] = '-';
                position[2] = 'k';
                position[0] = '-';
                position[3] = 'r';
                return;
            }
        }

        // all non-castling moves here

        if (Character.isLetter(promotionChar))
        {
            // promoting here

            position[dest] = Character.isUpperCase(position[source]) ?
                             promotionChar :
                             Character.toLowerCase(promotionChar);
        }
        else
        {
            // regular moves here

            position[dest] = position[source];
        }

        // if this was just an e.p capture remove the
        // catured pawn (which is not on the dest square)

        if (bIsEP)
        {
            if (Character.isUpperCase(position[source]))
            {
                position[dest + 8] = '-';
            }
            else
            {
                position[dest - 8] = '-';
            }
        }

        // remove the moved piece from the source square

        position[source] = '-';
    }
}

/*                               /*
           The Board                        The Old Board

8    0  1  2  3  4  5  6  7      8    1  2  3  4  5  6  7  8
7    8  9 10 11 12 13 14 15      7    9 10 11 12 13 14 15 16
6   16 17 18 19 20 21 22 23      6   17 18 19 20 21 22 23 24
5   24 25 26 27 28 29 30 31      5   25 26 27 28 29 30 31 32
4   32 33 34 35 36 37 38 39      4   33 34 35 36 37 38 39 40
3   40 41 42 43 44 45 46 47      3   41 42 43 44 45 46 47 48
2   48 49 50 51 52 53 54 55      2   49 50 51 52 53 54 55 56
1   56 57 58 59 60 61 62 63      1   57 58 59 60 61 63 63 64

    A  B  C  D  E  F  G  H           A  B  C  D  E  F  G  H
*/
