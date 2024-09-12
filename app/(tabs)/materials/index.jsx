import React, { useEffect, useState, useRef, useContext, useCallback } from 'react'
import { Animated, ScrollView, StyleSheet, SafeAreaView } from 'react-native'
import { router, useFocusEffect } from 'expo-router'
import { horizontalScale } from '../../../lib/metrics'
import { edModules } from '../../../lib/edModules'
import { firstaid } from '../../../lib/firstaid'
import { BookContext } from '../../../lib/bookContext'
import Title from '../../../components/titles'
import DynamicHeader from '../../../components/dynamicHeader'
import Resource from '../../../components/resource'
import colors from '../../../lib/colors'
import { getBooks, getEdBooks, getFirstBooks } from '../../../lib/api'


export default function Materials() {

    const scrollOffsetY = useRef(new Animated.Value(0)).current;

    const { setBook } = useContext(BookContext)


    const [filter, setFilter] = useState('All')
    const [dataset, setDataset] = useState([])
    const [edModules, setEdModules] = useState([])
    const [firstaid, setFirstAid] = useState([])
    const [resources, setResources] = useState([])

    const shuffleArray = (array) => {
        let shuffledArray = array.slice();
        for (let i = shuffledArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
        }
        return shuffledArray;
    };

    const fetchBooks = async () => {
        await getBooks()
            .then((response) => {
                const data = response.data
                const shuffledData = shuffleArray(data.books)
                setResources(shuffledData)
            })
            .catch(error => console.log('error fetching books', error))
    }

    const getAllEd = async () => {
        await getEdBooks()
            .then((response) => {
                const data = response.data
                setResources(data.books)
            })
            .catch(error => console.log('error fetching books', error))
    }

    const getAllFirst = async () => {
        await getFirstBooks()
            .then((response) => {
                const data = response.data
                setResources(data.books)
            })
            .catch(error => console.log('error fetching books', error))
    }

    useFocusEffect(
        useCallback(() => {
            fetchBooks()
        }, []))

    useEffect(() => {
        if (filter === 'All') {
            fetchBooks()
        } else if (filter === 'edModules') {
            getAllEd()
        } else {
            getAllFirst()
        }
    }, []);

    const handleFilter = (e) => {
        setFilter(e)
        e === 'All' ?
            fetchBooks() : e === 'edModules' ?
                getAllEd() : getAllFirst()
    }

    const handleNavgigation = (e) => {
        router.navigate({ pathname: `/materials/${e.title}`, params: { content: e.content, author: e.author, type: e.type } })
        setBook()
    }

    return (
        <>
            <Title
                title={'Materials'}
            />
            <SafeAreaView style={styles.main}>
                <DynamicHeader
                    animHeaderValue={scrollOffsetY}
                    onFilterSelect={(e) => handleFilter(e)}
                />
                <ScrollView
                    scrollEventThrottle={16}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { y: scrollOffsetY } } }],
                        { useNativeDriver: false }
                    )}
                    style={styles.contentContainer}
                >
                    {resources.map((item, index) =>
                        <Resource
                            key={index}
                            resourceType={item.type}
                            iconName={item.type === 'edModule' ? 'book' : 'first-aid'}
                            title={item.title}
                            author={item.author}
                            onpress={() => handleNavgigation(item)}
                        />)
                    }
                </ScrollView>
            </SafeAreaView>
        </>
    )
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        position: 'relative',
        backgroundColor: colors.background
    },
    contentContainer: {
        // flex: 1,
        // backgroundColor: '#dddddd',
        paddingHorizontal: horizontalScale(15),
    }
})